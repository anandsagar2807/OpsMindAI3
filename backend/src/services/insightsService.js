import fs from 'fs/promises';
import { getDocumentInsights as getOpenRouterInsights } from './openRouterService.js';

/**
 * Structured insights service.
 *
 * Always produces a structured insights object for every uploaded document so
 * the Insights page always has something meaningful to display, even when the
 * OpenRouter API is not configured. When OPENROUTER_API_KEY is set, we use it to
 * enrich the structured insights with an AI-generated narrative summary.
 *
 * The output structure is:
 * {
 *   summary:        string         // Short narrative summary (AI if available, heuristic otherwise)
 *   keyTopics:      string[]       // Top topics detected by keyword frequency
 *   keyPoints:      string[]       // Important sentences extracted from the text
 *   actionItems:    string[]       // Lines that look like TODOs / action items
 *   importantTerms: { term, count }[]  // Most-mentioned meaningful terms
 *   sections:       { heading, preview }[]  // Detected section headings + first sentence
 *   statistics: {
 *     wordCount, sentenceCount, paragraphCount, averageWordsPerSentence,
 *     readingTimeMinutes, uniqueWords, lexicalDensity
 *   }
 *   generatedBy:    'openrouter' | 'heuristic' | 'hybrid'
 *   generatedAt:    ISO timestamp
 * }
 */

// ─── Lightweight stop-word list (English) ────────────────────────────────────
const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'he', 'in', 'is', 'it', 'its',
    'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with', 'this', 'these', 'those', 'they', 'them',
    'their', 'there', 'here', 'what', 'when', 'where', 'which', 'who', 'whom', 'why', 'how', 'or', 'not', 'no',
    'if', 'then', 'than', 'so', 'such', 'but', 'also', 'can', 'could', 'should', 'would', 'may', 'might', 'must',
    'shall', 'do', 'does', 'did', 'doing', 'been', 'being', 'am', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he',
    'she', 'her', 'his', 'him', 'us', 'them', 'any', 'all', 'some', 'most', 'more', 'less', 'much', 'many', 'few',
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'about', 'above', 'after',
    'again', 'against', 'because', 'before', 'below', 'between', 'both', 'during', 'each', 'further', 'into',
    'just', 'now', 'only', 'other', 'out', 'over', 'own', 'same', 'through', 'under', 'until', 'very', 'while',
    'within', 'without', 'yours', 'ours', 'theirs', 'etc', 'eg', 'ie', 'vs', 'mr', 'mrs', 'dr'
]);

/**
 * Splits text into paragraphs (double newlines) and cleans them up.
 */
const splitParagraphs = (text) => {
    if (!text) return [];
    return text
        .split(/\n\s*\n+/g)
        .map((p) => p.replace(/\s+/g, ' ').trim())
        .filter((p) => p.length > 0);
};

/**
 * Splits a paragraph into sentences using a simple regex (works well for English).
 */
const splitSentences = (text) => {
    if (!text) return [];
    // Split on . ! ? followed by whitespace and a capital letter / end of string
    return text
        .replace(/\s+/g, ' ')
        .match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
};

/**
 * Extracts a set of "important" words from the text — words that appear frequently
 * and aren't stop words. Returns the top N with their counts.
 */
const extractImportantTerms = (text, topN = 12) => {
    if (!text) return [];
    const counts = new Map();
    const tokens = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((t) => t && t.length >= 4 && !STOP_WORDS.has(t));

    for (const tok of tokens) {
        counts.set(tok, (counts.get(tok) || 0) + 1);
    }

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, topN)
        .map(([term, count]) => ({ term, count }));
};

/**
 * Detects section headings (e.g. "1. Introduction", "Chapter 2", "### Methods")
 * along with the first sentence that follows each heading.
 */
const extractSections = (text) => {
    if (!text) return [];
    const lines = text.split(/\n+/);
    const sections = [];
    const headingRegex = /^\s*(?:#{1,6}\s+|(?:\d+(?:\.\d+)*\.?\s+)|(?:chapter|section|part|appendix)\s+[\w\d.]+[:.]?\s+)(.{2,80})$/i;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        if (headingRegex.test(line)) {
            const heading = line
                .replace(/^#{1,6}\s+/, '')
                .replace(/^(\d+(?:\.\d+)*\.?)\s+/, '$1 ')
                .trim();
            // Grab the first non-empty line that follows as a preview
            let preview = '';
            for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                const next = lines[j].trim();
                if (next && !headingRegex.test(next)) {
                    preview = next.length > 220 ? next.slice(0, 220) + '…' : next;
                    break;
                }
            }
            sections.push({ heading, preview });
            if (sections.length >= 12) break;
        }
    }
    return sections;
};

/**
 * Extracts action items — lines that look like TODOs, action items, or imperative
 * sentences starting with verbs like "must", "should", "need to", etc.
 */
const extractActionItems = (text) => {
    if (!text) return [];
    const sentences = splitSentences(text);
    const actionRegex = /^\s*(?:- \[ \]|☐|\* \[ \]|TODO:|FIXME:|NOTE:|Action:|Must|Should|Need to|Need|Required to|Recommended to|Please)\b/i;
    const imperativeRegex = /^[A-Z][a-z]+(?:\s+[a-z]+){0,4}\s+(?:must|should|need to|will|shall|has to|requires? to)\b/i;

    const items = [];
    for (const s of sentences) {
        if (actionRegex.test(s) || imperativeRegex.test(s)) {
            const cleaned = s.replace(/^[-*•\s]+/, '').replace(/^(?:TODO|FIXME|NOTE|Action)[:\s]+/i, '').trim();
            if (cleaned.length >= 12 && cleaned.length <= 220 && items.length < 8) {
                items.push(cleaned);
            }
        }
    }
    return items;
};

/**
 * Picks the most "important" sentences using a simple TF-based scoring heuristic:
 * sentences that contain more of the important terms are ranked higher.
 */
const extractKeyPoints = (text, importantTerms, topN = 6) => {
    if (!text) return [];
    const paragraphs = splitParagraphs(text);
    const termSet = new Set(importantTerms.map((t) => t.term));
    const scored = [];

    for (const p of paragraphs) {
        const sentences = splitSentences(p);
        for (const s of sentences) {
            const lower = s.toLowerCase();
            let score = 0;
            for (const t of termSet) {
                const matches = (lower.match(new RegExp(`\\b${t}\\b`, 'g')) || []).length;
                score += matches * Math.log(1 + matches);
            }
            // Prefer sentences of reasonable length (20–60 words)
            const words = s.split(/\s+/).length;
            if (words < 8 || words > 80) continue;
            if (score > 0) scored.push({ sentence: s, score });
        }
    }

    scored.sort((a, b) => b.score - a.score);
    const seen = new Set();
    const out = [];
    for (const { sentence } of scored) {
        // Deduplicate near-identical sentences
        const key = sentence.toLowerCase().slice(0, 80);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(sentence);
        if (out.length >= topN) break;
    }
    return out;
};

/**
 * Computes basic document statistics.
 */
const computeStatistics = (text) => {
    if (!text) {
        return {
            wordCount: 0,
            sentenceCount: 0,
            paragraphCount: 0,
            averageWordsPerSentence: 0,
            readingTimeMinutes: 0,
            uniqueWords: 0,
            lexicalDensity: 0,
        };
    }
    const paragraphs = splitParagraphs(text);
    const sentences = splitSentences(text);
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;
    const uniqueWordSet = new Set(words);
    const uniqueWords = uniqueWordSet.size;
    const averageWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));
    const lexicalDensity = wordCount > 0 ? +(uniqueWords / wordCount).toFixed(3) : 0;

    return {
        wordCount,
        sentenceCount,
        paragraphCount,
        averageWordsPerSentence,
        readingTimeMinutes,
        uniqueWords,
        lexicalDensity,
    };
};

/**
 * Generates a heuristic summary (no LLM required) from the top key points.
 */
const buildHeuristicSummary = (keyPoints, statistics) => {
    if (!keyPoints || keyPoints.length === 0) {
        return `This document contains ${statistics.wordCount.toLocaleString()} words across ${statistics.sentenceCount.toLocaleString()} sentences and ${statistics.paragraphCount.toLocaleString()} paragraphs. A detailed structural breakdown is available below.`;
    }
    const intro = `This ${statistics.wordCount.toLocaleString()}-word document (≈ ${statistics.readingTimeMinutes} min read) covers ${keyPoints.length} key themes.`;
    const bullets = keyPoints.slice(0, 3).map((p) => `• ${p}`).join('\n');
    return `${intro}\n\n${bullets}`;
};

/**
 * Public entry point — always returns a structured insights object.
 * If the OpenRouter API key is configured, we also include an AI-generated summary.
 */
export const generateStructuredInsights = async (text, options = {}) => {
    const { tryAI = true } = options;

    const importantTerms = extractImportantTerms(text, 12);
    const keyPoints = extractKeyPoints(text, importantTerms, 6);
    const sections = extractSections(text);
    const actionItems = extractActionItems(text);
    const statistics = computeStatistics(text);
    const keyTopics = importantTerms.slice(0, 8).map((t) => t.term);

    let summary = buildHeuristicSummary(keyPoints, statistics);
    let generatedBy = 'heuristic';
    let aiSummary = null;

    if (tryAI) {
        try {
            aiSummary = await getOpenRouterInsights(text);
            if (aiSummary && aiSummary.trim().length > 0) {
                summary = aiSummary.trim();
                generatedBy = 'hybrid';
            }
        } catch (err) {
            // Heuristic fallback is already in place — silently continue.
        }
    }

    return {
        summary,
        keyTopics,
        keyPoints,
        actionItems,
        importantTerms,
        sections,
        statistics,
        generatedBy,
        generatedAt: new Date().toISOString(),
    };
};

export default generateStructuredInsights;
