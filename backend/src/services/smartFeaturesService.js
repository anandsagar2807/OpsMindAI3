import Document from '../models/Document.js';
import SOPChunk from '../models/SOPChunk.js';
import SearchHistory from '../models/SearchHistory.js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';

/**
 * Shared OpenRouter chat-completion helper for the smart-feature endpoints.
 * Returns the raw text content from the model, or null on failure.
 */
async function llmComplete(systemPrompt, userPrompt, { temperature = 0.4, max_tokens = 1500 } = {}) {
    if (!OPENROUTER_API_KEY) return null;

    try {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.APP_URL || 'https://frontend-amber-six-35.vercel.app',
                'X-Title': 'OpsMind AI'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature,
                max_tokens,
                stream: false
            })
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            console.error('[smartFeatures] LLM request failed:', resp.status, text);
            return null;
        }

        const data = await resp.json();
        return data?.choices?.[0]?.message?.content || null;
    } catch (error) {
        console.error('[smartFeatures] LLM error:', error.message);
        return null;
    }
}

/**
 * Safely parse a JSON object/array from an LLM response that may contain
 * markdown code fences or surrounding prose.
 */
function parseJSONLoose(raw) {
    if (!raw) return null;
    let text = raw.trim();
    // Strip markdown code fences
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch) text = fenceMatch[1].trim();
    // Extract the first {...} or [...] block
    const start = text.search(/[[{]/);
    if (start !== -1) {
        const open = text[start];
        const close = open === '[' ? ']' : '}';
        const end = text.lastIndexOf(close);
        if (end > start) text = text.slice(start, end + 1);
    }
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

class SmartFeaturesService {
    /**
     * Generate suggested questions based on a document's content.
     * Falls back to heuristic questions when the LLM is unavailable.
     */
    async getSuggestedQuestions(documentId, userId) {
        const doc = await Document.findOne({ _id: documentId, uploadedBy: userId }).lean();
        if (!doc) throw new Error('Document not found');

        const chunks = await SOPChunk.find({ documentId })
            .sort({ chunkIndex: 1 })
            .limit(8)
            .lean();

        const sampleText = chunks.map(c => c.text).join('\n\n').slice(0, 3000);

        const systemPrompt = `You are an SOP analysis assistant. Given a sample of an SOP document, generate 5 insightful questions that a user would likely ask about this document. Return ONLY a JSON array of question strings. No explanation, no markdown.`;
        const userPrompt = `Document: ${doc.name}\n\nSample content:\n${sampleText}\n\nGenerate 5 questions:`;

        const raw = await llmComplete(systemPrompt, userPrompt, { temperature: 0.5, max_tokens: 600 });
        const parsed = parseJSONLoose(raw);

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter(q => typeof q === 'string').slice(0, 5);
        }

        // Heuristic fallback
        return [
            `What is the purpose of ${doc.name}?`,
            `What are the key steps in ${doc.name}?`,
            `Who is responsible for the procedures in ${doc.name}?`,
            `What are the risks mentioned in ${doc.name}?`,
            `What approvals are required in ${doc.name}?`
        ];
    }

    /**
     * Generate a structured AI summary of a document covering purpose,
     * responsibilities, workflow, key steps, risks, dependencies, and notes.
     */
    async getAISummary(documentId, userId) {
        const doc = await Document.findOne({ _id: documentId, uploadedBy: userId }).lean();
        if (!doc) throw new Error('Document not found');

        // Return cached summary if already generated
        if (doc.summary) {
            try {
                const cached = JSON.parse(doc.summary);
                if (cached && cached.purpose) return cached;
            } catch { /* fall through to regenerate */ }
        }

        const chunks = await SOPChunk.find({ documentId })
            .sort({ chunkIndex: 1 })
            .limit(20)
            .lean();

        const fullText = chunks.map(c => c.text).join('\n\n').slice(0, 8000);

        const systemPrompt = `You are an enterprise SOP analyst. Analyze the document and return a JSON object with these exact keys: "executiveSummary" (string), "purpose" (string), "responsibilities" (array of strings), "workflow" (array of strings), "keySteps" (array of strings), "risks" (array of strings), "dependencies" (array of strings), "importantNotes" (array of strings). Return ONLY valid JSON, no markdown fences.`;
        const userPrompt = `Document: ${doc.name}\n\nContent:\n${fullText}\n\nProvide the structured summary:`;

        const raw = await llmComplete(systemPrompt, userPrompt, { temperature: 0.3, max_tokens: 2000 });
        const parsed = parseJSONLoose(raw);

        const summary = parsed || {
            executiveSummary: doc.textPreview || 'Summary unavailable — LLM not configured.',
            purpose: 'Unable to determine automatically.',
            responsibilities: [],
            workflow: [],
            keySteps: [],
            risks: [],
            dependencies: [],
            importantNotes: []
        };

        // Cache the summary on the document
        await Document.updateOne({ _id: documentId }, { $set: { summary: JSON.stringify(summary) } });

        return summary;
    }

    /**
     * Detect SOP insights: missing approvals, missing responsibilities,
     * duplicate procedures, outdated versions, compliance issues, security
     * risks, incomplete sections, missing signatures, contradictions.
     */
    async getSOPInsights(documentId, userId) {
        const doc = await Document.findOne({ _id: documentId, uploadedBy: userId }).lean();
        if (!doc) throw new Error('Document not found');

        const chunks = await SOPChunk.find({ documentId })
            .sort({ chunkIndex: 1 })
            .limit(20)
            .lean();

        const fullText = chunks.map(c => c.text).join('\n\n').slice(0, 8000);

        const systemPrompt = `You are an SOP compliance auditor. Analyze the document and detect issues. Return a JSON object with keys: "missingApprovals" (array), "missingResponsibilities" (array), "duplicateProcedures" (array), "outdatedVersions" (array), "complianceIssues" (array), "securityRisks" (array), "incompleteSections" (array), "missingSignatures" (array), "contradictions" (array). Each array item should be a short string describing the issue. Return ONLY valid JSON.`;
        const userPrompt = `Document: ${doc.name} (v${doc.version})\n\nContent:\n${fullText}\n\nAudit this SOP:`;

        const raw = await llmComplete(systemPrompt, userPrompt, { temperature: 0.2, max_tokens: 2000 });
        const parsed = parseJSONLoose(raw);

        if (parsed) {
            return {
                documentId,
                documentName: doc.name,
                version: doc.version,
                insights: parsed,
                generatedBy: 'openrouter',
                generatedAt: new Date().toISOString()
            };
        }

        // Heuristic fallback — basic detection
        const text = fullText.toLowerCase();
        return {
            documentId,
            documentName: doc.name,
            version: doc.version,
            insights: {
                missingApprovals: text.includes('approval') ? [] : ['No approval workflow detected'],
                missingResponsibilities: text.includes('responsible') ? [] : ['No responsible parties explicitly defined'],
                duplicateProcedures: [],
                outdatedVersions: [],
                complianceIssues: [],
                securityRisks: [],
                incompleteSections: text.includes('todo') || text.includes('tbd') ? ['Contains TODO/TBD markers'] : [],
                missingSignatures: text.includes('signature') ? [] : ['No signature section found'],
                contradictions: []
            },
            generatedBy: 'heuristic',
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Extract actionable tasks from a document.
     */
    async getActionItems(documentId, userId) {
        const doc = await Document.findOne({ _id: documentId, uploadedBy: userId }).lean();
        if (!doc) throw new Error('Document not found');

        const chunks = await SOPChunk.find({ documentId })
            .sort({ chunkIndex: 1 })
            .limit(20)
            .lean();

        const fullText = chunks.map(c => c.text).join('\n\n').slice(0, 8000);

        const systemPrompt = `You are an SOP action-item extractor. Identify all actionable tasks in the document. Return ONLY a JSON array of objects with keys: "task" (string), "priority" ("high"|"medium"|"low"), "assignee" (string or null). No markdown.`;
        const userPrompt = `Document: ${doc.name}\n\nContent:\n${fullText}\n\nExtract action items:`;

        const raw = await llmComplete(systemPrompt, userPrompt, { temperature: 0.3, max_tokens: 1500 });
        const parsed = parseJSONLoose(raw);

        if (Array.isArray(parsed)) {
            return parsed.filter(item => item && typeof item.task === 'string');
        }

        // Heuristic fallback — find lines with action verbs
        const actionVerbs = /\b(must|shall|should|will|ensure|verify|review|update|approve|submit|conduct|perform|check)\b/gi;
        const lines = fullText.split('\n').filter(l => actionVerbs.test(l));
        return lines.slice(0, 8).map(line => ({
            task: line.trim().slice(0, 200),
            priority: 'medium',
            assignee: null
        }));
    }

    /**
     * Build a sequential SOP timeline from the document's procedural steps.
     */
    async getSOPTimeline(documentId, userId) {
        const doc = await Document.findOne({ _id: documentId, uploadedBy: userId }).lean();
        if (!doc) throw new Error('Document not found');

        const chunks = await SOPChunk.find({ documentId })
            .sort({ chunkIndex: 1 })
            .limit(20)
            .lean();

        const fullText = chunks.map(c => c.text).join('\n\n').slice(0, 8000);

        const systemPrompt = `You are an SOP process analyst. Extract the sequential workflow steps from the document and return them as a timeline. Return ONLY a JSON array of objects with keys: "step" (number), "title" (string), "description" (string), "type" ("action"|"approval"|"verification"|"execution"|"completion"). No markdown.`;
        const userPrompt = `Document: ${doc.name}\n\nContent:\n${fullText}\n\nBuild the timeline:`;

        const raw = await llmComplete(systemPrompt, userPrompt, { temperature: 0.3, max_tokens: 1500 });
        const parsed = parseJSONLoose(raw);

        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, i) => ({
                step: item.step || i + 1,
                title: item.title || `Step ${i + 1}`,
                description: item.description || '',
                type: item.type || 'action'
            }));
        }

        // Heuristic fallback — use detected sections
        return chunks.slice(0, 6).map((chunk, i) => ({
            step: i + 1,
            title: chunk.sectionTitle || `Step ${i + 1}`,
            description: chunk.text.slice(0, 150),
            type: 'action'
        }));
    }

    /**
     * Suggest related SOPs based on shared tags, category, or department.
     */
    async getRelatedSOPs(documentId, userId) {
        const doc = await Document.findOne({ _id: documentId, uploadedBy: userId }).lean();
        if (!doc) throw new Error('Document not found');

        // Find documents sharing tags, category, or department
        const related = await Document.find({
            uploadedBy: userId,
            _id: { $ne: documentId },
            status: 'completed',
            $or: [
                { tags: { $in: doc.tags || [] } },
                { category: doc.category },
                { department: doc.department }
            ]
        })
            .limit(5)
            .select('name category department version tags createdAt totalChunks')
            .lean();

        // Score by overlap
        return related.map(r => {
            let score = 0;
            if (r.category === doc.category) score += 2;
            if (r.department === doc.department) score += 2;
            const sharedTags = (r.tags || []).filter(t => (doc.tags || []).includes(t));
            score += sharedTags.length;
            return { ...r, relevanceScore: score, sharedTags };
        }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    /**
     * Record a search query in the search history for analytics.
     */
    async recordSearch(userId, orgId, query, result) {
        try {
            await SearchHistory.create({
                userId,
                orgId,
                query,
                resultsCount: result?.results?.length || result?.metadata?.totalChunks || 0,
                avgConfidence: result?.results?.length
                    ? result.results.reduce((sum, r) => sum + (r.similarity || 0), 0) / result.results.length
                    : 0,
                documentIds: (result?.results || []).map(r => r.documentId).filter(Boolean),
                retrievalTimeMs: result?.metadata?.retrievalTimeMs || 0
            });
        } catch (error) {
            console.error('[smartFeatures] Failed to record search:', error.message);
        }
    }

    /**
     * Get search analytics for the dashboard widgets.
     */
    async getSearchAnalytics(userId) {
        const totalSearches = await SearchHistory.countDocuments({ userId });
        const recentSearches = await SearchHistory.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const avgConfidenceAgg = await SearchHistory.aggregate([
            { $match: { userId } },
            { $group: { _id: null, avgConfidence: { $avg: '$avgConfidence' } } }
        ]);
        const avgConfidence = avgConfidenceAgg[0]?.avgConfidence || 0;

        // Most referenced documents
        const mostReferenced = await SearchHistory.aggregate([
            { $match: { userId } },
            { $unwind: '$documentIds' },
            { $group: { _id: '$documentIds', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'documents',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'doc'
                }
            },
            { $unwind: { path: '$doc', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    documentId: '$_id',
                    name: '$doc.name',
                    count: 1
                }
            }
        ]);

        return {
            totalSearches,
            avgConfidence: Math.round(avgConfidence * 100),
            recentSearches: recentSearches.map(s => ({ query: s.query, createdAt: s.createdAt })),
            mostReferenced
        };
    }
}

export default new SmartFeaturesService();
