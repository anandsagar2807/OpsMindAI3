import { extractTextFromPDF } from './pdfProcessor.js';
import fs from 'fs/promises';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

const OPSMIND_ANALYSIS_PROMPT = `You are OpsMind AI — an expert operational knowledge analyst specializing in Standard Operating Procedures (SOPs), compliance frameworks, and operational readiness assessment. Your task is to analyze an organization's SOP document against compliance standards and provide detailed, actionable insights about alignment, gaps, and operational readiness.

You MUST respond in the following JSON format (no markdown, no code fences — pure JSON only):

{
  "alignmentScore": <number 0-100 representing overall SOP-to-standards alignment>,
  "summary": "<2-3 sentence overview of how well the SOP document aligns with the compliance standards and operational readiness level>",
  "alignedItems": [
    {
      "name": "<SOP area or procedure that is well-aligned>",
      "matchPercentage": <number 0-100 representing alignment strength>,
      "category": "<category like Safety, Quality, Process Control, Documentation, Training, Audit, Risk Management, etc.>"
    }
  ],
  "gapItems": [
    {
      "name": "<compliance requirement or operational standard that is missing or inadequately covered>",
      "matchPercentage": <number 0-100 representing current coverage level, typically low>,
      "category": "<category>"
    }
  ],
  "insights": [
    {
      "type": "<aligned|compliance|coverage|procedure|recommendation|action|risk>",
      "title": "<insight title>",
      "content": "<detailed explanation with specific reference to SOP sections or compliance clauses>"
    }
  ],
  "answers": [
    {
      "question": "<the user's question if provided>",
      "answer": "<detailed answer addressing the question in the context of SOP compliance and operational readiness>"
    }
  ]
}

ANALYSIS GUIDELINES:
1. Be thorough and specific — identify both explicit and implicit compliance requirements from the standards document.
2. For aligned items, assess how well the SOP's procedures, controls, and documentation match the standards (not just keyword matching).
3. For gap items, be constructive — suggest specific SOP additions, modifications, or new procedures needed to achieve compliance.
4. Provide at least 3-5 aligned items and 2-4 gap items.
5. Include actionable recommendations in insights — reference specific sections, clauses, or requirements.
6. Categorize items using operational domains: Safety, Quality, Process Control, Documentation, Training, Audit, Risk Management, Environmental, Data Security, etc.
7. If the user provided specific questions, answer each one thoroughly in the "answers" array, grounding answers in both the SOP content and compliance standards.
8. If no questions were provided, leave the "answers" array empty.
9. Score fairly — alignmentScore should reflect the true operational readiness level. A score of 80+ means excellent alignment, 60-79 means good alignment with minor gaps, 40-59 means partial alignment with significant gaps, below 40 means critical compliance deficiencies.
10. Always frame your analysis in the context of operational excellence, compliance readiness, and continuous improvement — this is OpsMind AI, an enterprise SOP intelligence platform.`;

async function callOpenRouter(messages) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured. Set OPENROUTER_API_KEY in .env to enable operational knowledge analysis.');
    }

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.APP_URL || 'https://frontend-amber-six-35.vercel.app',
            'X-Title': 'OpsMind AI - Operational Knowledge Analysis'
        },
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages,
            temperature: 0.3,
            max_tokens: 4000,
            top_p: 0.9,
            stream: false
        })
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`OpenRouter request failed (${resp.status}): ${text || resp.statusText}`);
    }

    return resp.json();
}

/**
 * Extract text from an uploaded file based on its type
 */
async function extractTextFromFile(filePath, mimeType, originalName) {
    const ext = originalName.toLowerCase().slice(originalName.lastIndexOf('.'));

    if (mimeType === 'application/pdf' || ext === '.pdf') {
        const result = await extractTextFromPDF(filePath);
        return result.text;
    }

    // For DOCX and TXT, read as plain text
    // Note: DOCX is a zip format — for proper extraction, a library like mammoth would be needed.
    // For now, we attempt to read it as text which works for .txt files.
    // DOCX files will need mammoth or similar library for proper extraction.
    if (mimeType === 'text/plain' || ext === '.txt') {
        const text = await fs.readFile(filePath, 'utf-8');
        return text;
    }

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx') {
        // Try to read as text — this won't work well for actual DOCX (which is zipped XML),
        // but we'll attempt it and fall back gracefully
        try {
            const text = await fs.readFile(filePath, 'utf-8');
            if (text.length > 100) {
                return text;
            }
        } catch (e) {
            // Binary file, can't read as text
        }
        // For DOCX, we'd need mammoth — return a notice
        return '[DOCX file uploaded — for best results, please paste the content directly using the text input option, or convert to PDF/TXT format]';
    }

    // Fallback: try reading as text
    try {
        const text = await fs.readFile(filePath, 'utf-8');
        return text;
    } catch (e) {
        return '[Unable to extract text from this file format]';
    }
}

/**
 * Main analysis function — analyzes SOP document against compliance standards
 */
export async function analyzeSkills({ sopFile, standardsFile, sopText, standardsText, query }) {
    let sopContent = sopText || '';
    let standardsContent = standardsText || '';

    // Extract text from uploaded files
    if (sopFile) {
        const extracted = await extractTextFromFile(
            sopFile.path,
            sopFile.mimetype,
            sopFile.originalname
        );
        sopContent = sopContent || extracted;
    }

    if (standardsFile) {
        const extracted = await extractTextFromFile(
            standardsFile.path,
            standardsFile.mimetype,
            standardsFile.originalname
        );
        standardsContent = standardsContent || extracted;
    }

    if (!sopContent.trim()) {
        throw new Error('No SOP document content provided. Please upload a file or paste your SOP text.');
    }

    if (!standardsContent.trim()) {
        throw new Error('No compliance standards content provided. Please upload a file or paste the standards text.');
    }

    // Truncate very long content to stay within token limits
    const MAX_CHARS = 8000;
    if (sopContent.length > MAX_CHARS) {
        sopContent = sopContent.slice(0, MAX_CHARS) + '\n[...truncated for analysis]';
    }
    if (standardsContent.length > MAX_CHARS) {
        standardsContent = standardsContent.slice(0, MAX_CHARS) + '\n[...truncated for analysis]';
    }

    // Build the messages for the AI
    const userMessage = `## SOP DOCUMENT CONTENT:
${sopContent}

## COMPLIANCE STANDARDS CONTENT:
${standardsContent}

${query ? `## USER'S SPECIFIC QUESTIONS:\n${query}` : '## No specific questions provided — focus on SOP-to-standards alignment analysis and gap identification.'}

Please analyze the SOP document against the compliance standards and provide the structured JSON response as specified. Focus on operational readiness, compliance alignment, and actionable gap remediation.`;

    const messages = [
        { role: 'system', content: OPSMIND_ANALYSIS_PROMPT },
        { role: 'user', content: userMessage }
    ];

    const response = await callOpenRouter(messages);

    const content = response.choices?.[0]?.message?.content || '';

    // Parse the JSON response — the AI might wrap it in markdown code fences
    let parsed;
    try {
        // Strip markdown code fences if present
        let jsonStr = content.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }
        parsed = JSON.parse(jsonStr);
    } catch (parseError) {
        // If JSON parsing fails, return the raw text as a fallback
        console.error('Failed to parse operational knowledge analysis JSON:', parseError.message);
        parsed = {
            alignmentScore: 0,
            summary: 'Analysis completed but results could not be structured properly.',
            alignedItems: [],
            gapItems: [],
            insights: [],
            answers: [],
            rawAnalysis: content
        };
    }

    // Ensure the response has the expected structure with OpsMind-specific field names
    // Also provide fallback field names that the frontend can handle
    return {
        alignmentScore: parsed.alignmentScore ?? parsed.overallScore ?? parsed.score ?? 0,
        overallScore: parsed.alignmentScore ?? parsed.overallScore ?? parsed.score ?? 0, // fallback for frontend compatibility
        summary: parsed.summary ?? parsed.overview ?? '',
        alignedItems: (parsed.alignedItems ?? parsed.matchedSkills ?? parsed.skills ?? []).map(s => ({
            name: s.name ?? s.skill ?? '',
            matchPercentage: s.matchPercentage ?? s.match ?? s.percentage ?? 75,
            category: s.category ?? s.type ?? 'General',
        })),
        matchedSkills: (parsed.alignedItems ?? parsed.matchedSkills ?? parsed.skills ?? []).map(s => ({
            name: s.name ?? s.skill ?? '',
            matchPercentage: s.matchPercentage ?? s.match ?? s.percentage ?? 75,
            category: s.category ?? s.type ?? 'General',
        })), // fallback for frontend compatibility
        gapItems: (parsed.gapItems ?? parsed.gapSkills ?? parsed.gaps ?? parsed.missingSkills ?? []).map(s => ({
            name: s.name ?? s.skill ?? '',
            matchPercentage: s.matchPercentage ?? s.match ?? s.percentage ?? 25,
            category: s.category ?? s.type ?? 'General',
        })),
        gapSkills: (parsed.gapItems ?? parsed.gapSkills ?? parsed.gaps ?? parsed.missingSkills ?? []).map(s => ({
            name: s.name ?? s.skill ?? '',
            matchPercentage: s.matchPercentage ?? s.match ?? s.percentage ?? 25,
            category: s.category ?? s.type ?? 'General',
        })), // fallback for frontend compatibility
        insights: (parsed.insights ?? parsed.recommendations ?? []).map(i => ({
            type: i.type ?? i.category ?? 'recommendation',
            title: i.title ?? i.name ?? 'Insight',
            content: i.content ?? i.description ?? i.text ?? i.message ?? '',
        })),
        answers: (parsed.answers ?? parsed.queryResponses ?? []).map(a => ({
            question: a.question ?? '',
            answer: a.answer ?? a.content ?? a.text ?? a.response ?? '',
        })),
    };
}

export default { analyzeSkills };