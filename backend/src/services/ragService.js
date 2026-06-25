import vectorSearchService from './vectorSearchService.js';
import { generateCitations } from './citationService.js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

const SYSTEM_PROMPT = `You are an enterprise SOP (Standard Operating Procedure) assistant. Your role is to answer questions STRICTLY based on the provided SOP document context.
 
CRITICAL RULES:
1. ONLY answer using information from the provided context chunks.
2. If the context does not contain relevant information to answer the question, respond with: "I don't know based on the uploaded SOP documents."
3. NEVER fabricate, guess, or hallucinate information.
4. ALWAYS cite your sources using the format: "According to [DocumentName] Page [X] Section [Y]..."
5. Be precise, factual, and concise.
6. If multiple sources support your answer, cite all of them.
7. If the context is ambiguous, acknowledge the ambiguity rather than making assumptions.
8. Format your answers clearly with proper structure when appropriate.
 
You are a trusted enterprise knowledge assistant. Accuracy and source grounding are your top priorities.`;

const FALLBACK_SYSTEM_PROMPT = `You are OpsMind AI, an enterprise-grade operations assistant. You help users with document management, SOP workflows, and operational queries.
 
CURRENT STATUS: You are running in fallback mode — document embeddings are unavailable (OpenRouter free tier does not include embedding models). You can still answer general questions and assist with operations knowledge.
 
GUIDELINES:
1. Be helpful, professional, and concise.
2. Acknowledge when you don't have access to document context.
3. Suggest that the user upgrade to OpenRouter credits for full RAG capabilities (document search + cited answers).
4. You can still help with general operational questions, explanations, and guidance.

Your purpose is to help teams manage their SOP documentation and operational workflows efficiently.`;

async function openRouterChatCompletions({ messages, temperature, max_tokens, top_p }) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured. Set OPENROUTER_API_KEY in .env to enable RAG chat features.');
    }

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
            messages,
            temperature,
            max_tokens,
            top_p,
            stream: false
        })
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`OpenRouter request failed (${resp.status}): ${text || resp.statusText}`);
    }

    return resp.json();
}

async function* openRouterStreamChatCompletions({ messages, temperature, max_tokens, top_p }) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured. Set OPENROUTER_API_KEY in .env to enable RAG chat features.');
    }

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
            messages,
            temperature,
            max_tokens,
            top_p,
            stream: true
        })
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`OpenRouter stream request failed (${resp.status}): ${text || resp.statusText}`);
    }

    const reader = resp.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (!trimmed.startsWith('data:')) continue;

            const data = trimmed.slice('data:'.length).trim();
            if (data === '[DONE]') return;

            // Expect JSON payloads
            try {
                const parsed = JSON.parse(data);
                const content = parsed?.choices?.[0]?.delta?.content;
                if (content) {
                    yield content;
                }
            } catch {
                // ignore partial/unexpected chunks
            }
        }
    }
}

class RAGService {
    async generateResponse(query, userId, options = {}) {
        const startTime = Date.now();

        try {
            const searchResult = await vectorSearchService.search(query, userId, {
                topK: 5,
                minSimilarity: 0.3
            });

            const retrievalTimeMs = Date.now() - startTime;

            if (!searchResult.success || searchResult.results.length === 0) {
                return {
                    answer: "I don't know based on the uploaded SOP documents.",
                    citations: [],
                    retrievalMetadata: {
                        ...searchResult.metadata,
                        retrievalTimeMs,
                        generationTimeMs: 0,
                        totalChunksRetrieved: 0,
                        llmModel: OPENROUTER_MODEL
                    },
                    hasContext: false
                };
            }

            const contextString = searchResult.results.map((chunk, index) => {
                const docName = chunk.documentName || chunk.metadata?.documentName || 'Unknown Document';
                const page = chunk.pageNumber || 'unknown';
                const section = chunk.sectionTitle || 'unknown section';
                return `[Source ${index + 1}: "${docName}" Page ${page} Section "${section}" | Similarity: ${chunk.similarity.toFixed(3)}]\n${chunk.text}\n`;
            }).join('\n---\n');

            const prompt = `${SYSTEM_PROMPT}\n\nCONTEXT FROM SOP DOCUMENTS:\n${contextString}\n\nUSER QUESTION: ${query}\n\nProvide a grounded answer with citations. If the context doesn't contain the answer, say "I don't know based on the uploaded SOP documents."`;

            const generationStart = Date.now();

            const completion = await openRouterChatCompletions({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                temperature: options.temperature ?? 0.3,
                max_tokens: options.maxTokens ?? 2048,
                top_p: options.topP ?? 1.0
            });

            const answer = completion?.choices?.[0]?.message?.content || '';
            const generationTimeMs = Date.now() - generationStart;

            const citations = generateCitations(searchResult.results, answer);

            return {
                answer,
                citations,
                retrievalMetadata: {
                    ...searchResult.metadata,
                    retrievalTimeMs,
                    generationTimeMs,
                    totalChunksRetrieved: searchResult.results.length,
                    llmModel: OPENROUTER_MODEL
                },
                hasContext: true,
                sources: searchResult.results.map(r => ({
                    documentId: r.documentId,
                    documentName: r.documentName || r.metadata?.documentName || 'Unknown',
                    pageNumber: r.pageNumber,
                    similarity: r.similarity
                }))
            };
        } catch (error) {
            console.error('RAG generateResponse error:', error.message);

            // Fallback: if embedding/vector search fails (e.g., OpenRouter free tier
            // lacks embedding credits), answer directly via the LLM without document context
            if (
                error.message.includes('embedding') ||
                error.message.includes('Embedding') ||
                error.message.includes('402')
            ) {
                try {
                    console.log('⚠️  [ragService] Embedding unavailable — falling back to direct LLM response.');
                    const generationStart = Date.now();

                    const completion = await openRouterChatCompletions({
                        messages: [
                            { role: 'system', content: FALLBACK_SYSTEM_PROMPT },
                            { role: 'user', content: query }
                        ],
                        temperature: options.temperature ?? 0.7,
                        max_tokens: options.maxTokens ?? 2048,
                        top_p: options.topP ?? 1.0
                    });

                    const answer = completion?.choices?.[0]?.message?.content || '';
                    const generationTimeMs = Date.now() - generationStart;

                    return {
                        answer,
                        citations: [],
                        retrievalMetadata: {
                            totalChunks: 0,
                            documentsSearched: 0,
                            retrievalTimeMs: 0,
                            generationTimeMs,
                            totalChunksRetrieved: 0,
                            llmModel: OPENROUTER_MODEL,
                            fallbackMode: true
                        },
                        hasContext: false,
                        sources: []
                    };
                } catch (fallbackError) {
                    console.error('RAG fallback error:', fallbackError.message);
                    throw fallbackError;
                }
            }

            throw error;
        }
    }

    async *streamResponse(query, userId, options = {}) {
        const startTime = Date.now();

        try {
            const searchResult = await vectorSearchService.search(query, userId, {
                topK: 5,
                minSimilarity: 0.3
            });

            const retrievalTimeMs = Date.now() - startTime;

            // Emit retrieval metadata
            const metadata = {
                ...searchResult.metadata,
                retrievalTimeMs,
                totalChunksRetrieved: searchResult.results.length,
                hasContext: searchResult.success && searchResult.results.length > 0,
                llmModel: OPENROUTER_MODEL
            };
            yield { type: 'metadata', data: metadata };

            if (!searchResult.success || searchResult.results.length === 0) {
                const noAnswer = "I don't know based on the uploaded SOP documents.";
                yield { type: 'metadata', data: { ...metadata, citations: [], generationTimeMs: 0 } };
                yield { type: 'content', data: noAnswer };
                yield { type: 'generation_complete', data: { fullAnswer: noAnswer, citations: [] } };
                yield { type: 'done' };
                return;
            }

            const contextString = searchResult.results.map((chunk, index) => {
                const docName = chunk.documentName || chunk.metadata?.documentName || 'Unknown Document';
                const page = chunk.pageNumber || 'unknown';
                const section = chunk.sectionTitle || 'unknown section';
                return `[Source ${index + 1}: "${docName}" Page ${page} Section "${section}" | Similarity: ${chunk.similarity.toFixed(3)}]\n${chunk.text}\n`;
            }).join('\n---\n');

            const prompt = `${SYSTEM_PROMPT}\n\nCONTEXT FROM SOP DOCUMENTS:\n${contextString}\n\nUSER QUESTION: ${query}\n\nProvide a grounded answer with citations. If the context doesn't contain the answer, say "I don't know based on the uploaded SOP documents."`;

            const generationStart = Date.now();
            let fullAnswer = '';

            const stream = openRouterStreamChatCompletions({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                temperature: options.temperature ?? 0.3,
                max_tokens: options.maxTokens ?? 2048,
                top_p: options.topP ?? 1.0
            });

            for await (const chunk of stream) {
                fullAnswer += chunk;
                yield { type: 'content', data: chunk };
            }

            const generationTimeMs = Date.now() - generationStart;
            const citations = generateCitations(searchResult.results, fullAnswer);

            yield {
                type: 'generation_complete',
                data: {
                    fullAnswer,
                    citations,
                    generationTimeMs
                }
            };

            yield {
                type: 'done',
                data: {
                    retrievalTimeMs,
                    generationTimeMs,
                    llmModel: OPENROUTER_MODEL
                }
            };
        } catch (error) {
            console.error('RAG streamResponse error:', error.message);

            // Fallback: if embedding/vector search fails, stream a direct LLM answer
            if (
                error.message.includes('embedding') ||
                error.message.includes('Embedding') ||
                error.message.includes('402')
            ) {
                try {
                    console.log('⚠️  [ragService] Embedding unavailable — falling back to direct LLM streaming.');
                    const fallbackMetadata = {
                        totalChunks: 0,
                        documentsSearched: 0,
                        retrievalTimeMs: 0,
                        totalChunksRetrieved: 0,
                        hasContext: false,
                        llmModel: OPENROUTER_MODEL,
                        fallbackMode: true
                    };
                    yield { type: 'metadata', data: fallbackMetadata };

                    const generationStart = Date.now();
                    let fullAnswer = '';

                    const fallbackStream = openRouterStreamChatCompletions({
                        messages: [
                            { role: 'system', content: FALLBACK_SYSTEM_PROMPT },
                            { role: 'user', content: query }
                        ],
                        temperature: options.temperature ?? 0.7,
                        max_tokens: options.maxTokens ?? 2048,
                        top_p: options.topP ?? 1.0
                    });

                    for await (const chunk of fallbackStream) {
                        fullAnswer += chunk;
                        yield { type: 'content', data: chunk };
                    }

                    const generationTimeMs = Date.now() - generationStart;

                    yield {
                        type: 'generation_complete',
                        data: { fullAnswer, citations: [], generationTimeMs }
                    };
                    yield {
                        type: 'done',
                        data: { retrievalTimeMs: 0, generationTimeMs, llmModel: OPENROUTER_MODEL, fallbackMode: true }
                    };
                    return;
                } catch (fallbackError) {
                    console.error('RAG stream fallback error:', fallbackError.message);
                    yield { type: 'error', data: fallbackError.message };
                    yield { type: 'done' };
                    return;
                }
            }

            yield { type: 'error', data: error.message };
            yield { type: 'done' };
        }
    }

    async search(query, userId, options = {}) {
        try {
            const result = await vectorSearchService.search(query, userId, {
                topK: options.topK || 5,
                minSimilarity: options.minSimilarity || 0.3
            });
            return result;
        } catch (error) {
            console.error('RAG search error:', error.message);
            return { success: false, results: [], metadata: {} };
        }
    }
}

export default new RAGService();
