import Groq from 'groq-sdk';
import vectorSearchService from './vectorSearchService.js';
import { generateCitations } from './citationService.js';

let groq = null;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (GROQ_API_KEY && GROQ_API_KEY !== 'your-groq-api-key-here') {
    groq = new Groq({ apiKey: GROQ_API_KEY });
} else {
    console.warn('⚠️  [ragService] GROQ_API_KEY is a placeholder — RAG chat features will be unavailable until a valid key is provided.');
    console.warn('⚠️  [ragService] Get your key from https://console.groq.com');
}

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

class RAGService {
    async generateResponse(query, userId, options = {}) {
        if (!groq) {
            throw new Error('Groq API key is not configured. Set GROQ_API_KEY in .env to enable RAG chat features.');
        }
        const startTime = Date.now();

        try {
            // Step 1: Retrieve relevant chunks
            const searchResult = await vectorSearchService.search(query, userId, {
                topK: 5,
                minSimilarity: 0.3
            });

            const retrievalTimeMs = Date.now() - startTime;

            // Step 2: Check if we have relevant context
            if (!searchResult.success || searchResult.results.length === 0) {
                return {
                    answer: "I don't know based on the uploaded SOP documents.",
                    citations: [],
                    retrievalMetadata: {
                        ...searchResult.metadata,
                        retrievalTimeMs,
                        generationTimeMs: 0,
                        totalChunksRetrieved: 0,
                        llmModel: GROQ_MODEL
                    },
                    hasContext: false
                };
            }

            // Step 3: Build context string
            const contextString = searchResult.results.map((chunk, index) => {
                const docName = chunk.documentName || chunk.metadata?.documentName || 'Unknown Document';
                const page = chunk.pageNumber || 'unknown';
                const section = chunk.sectionTitle || 'unknown section';
                return `[Source ${index + 1}: "${docName}" Page ${page} Section "${section}" | Similarity: ${chunk.similarity.toFixed(3)}]\n${chunk.text}\n`;
            }).join('\n---\n');

            const prompt = `${SYSTEM_PROMPT}\n\nCONTEXT FROM SOP DOCUMENTS:\n${contextString}\n\nUSER QUESTION: ${query}\n\nProvide a grounded answer with citations. If the context doesn't contain the answer, say "I don't know based on the uploaded SOP documents."`;

            // Step 4: Generate response with Groq
            const generationStart = Date.now();
            const completion = await groq.chat.completions.create({
                model: GROQ_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 2048,
                top_p: 0.9,
                stream: false
            });

            const generationTimeMs = Date.now() - generationStart;
            const answer = completion.choices[0]?.message?.content || "I don't know based on the uploaded SOP documents.";

            // Step 5: Generate citations
            const citations = generateCitations(searchResult.results, answer);

            return {
                answer,
                citations,
                retrievalMetadata: {
                    ...searchResult.metadata,
                    retrievalTimeMs,
                    generationTimeMs,
                    totalChunksRetrieved: searchResult.results.length,
                    contextTokens: Math.ceil(contextString.length / 4),
                    responseTokens: completion.usage?.completion_tokens || Math.ceil(answer.length / 4),
                    queryTokens: completion.usage?.prompt_tokens || Math.ceil(query.length / 4),
                    llmModel: GROQ_MODEL,
                    embeddingModel: 'embedding-001'
                },
                hasContext: true,
                sources: searchResult.results
            };
        } catch (error) {
            console.error('RAG generation error:', error);
            throw new Error('Failed to generate RAG response: ' + error.message);
        }
    }

    async *streamResponse(query, userId, options = {}) {
        if (!groq) {
            yield { type: 'error', data: 'Groq API key is not configured. Set GROQ_API_KEY in .env to enable RAG chat features.' };
            yield { type: 'done' };
            return;
        }
        const startTime = Date.now();

        // Step 1: Retrieve relevant chunks
        const searchResult = await vectorSearchService.search(query, userId, {
            topK: 5,
            minSimilarity: 0.3
        });

        const retrievalTimeMs = Date.now() - startTime;

        // Step 2: No context case
        if (!searchResult.success || searchResult.results.length === 0) {
            yield {
                type: 'metadata',
                data: {
                    retrievalTimeMs,
                    totalChunksRetrieved: 0,
                    hasContext: false,
                    citations: []
                }
            };
            yield { type: 'content', data: "I don't know based on the uploaded SOP documents." };
            yield { type: 'done' };
            return;
        }

        // Step 3: Build context
        const contextString = searchResult.results.map((chunk, index) => {
            const docName = chunk.documentName || chunk.metadata?.documentName || 'Unknown Document';
            const page = chunk.pageNumber || 'unknown';
            const section = chunk.sectionTitle || 'unknown section';
            return `[Source ${index + 1}: "${docName}" Page ${page} Section "${section}" | Similarity: ${chunk.similarity.toFixed(3)}]\n${chunk.text}\n`;
        }).join('\n---\n');

        const prompt = `${SYSTEM_PROMPT}\n\nCONTEXT FROM SOP DOCUMENTS:\n${contextString}\n\nUSER QUESTION: ${query}\n\nProvide a grounded answer with citations. If the context doesn't contain the answer, say "I don't know based on the uploaded SOP documents."`;

        // Step 4: Generate citations
        const citations = generateCitations(searchResult.results);

        // Step 5: Stream metadata first
        yield {
            type: 'metadata',
            data: {
                retrievalTimeMs,
                totalChunksRetrieved: searchResult.results.length,
                hasContext: true,
                citations,
                sources: searchResult.results.map(r => ({
                    documentId: r.documentId,
                    documentName: r.documentName || r.metadata?.documentName,
                    pageNumber: r.pageNumber,
                    sectionTitle: r.sectionTitle,
                    similarity: r.similarity,
                    chunkIndex: r.chunkIndex,
                    snippet: r.text.substring(0, 200)
                }))
            }
        };

        // Step 6: Stream Groq response
        const generationStart = Date.now();
        const stream = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 2048,
            top_p: 0.9,
            stream: true
        });

        let fullAnswer = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                fullAnswer += content;
                yield { type: 'content', data: content };
            }
        }

        const generationTimeMs = Date.now() - generationStart;

        yield {
            type: 'generation_complete',
            data: {
                generationTimeMs,
                responseTokens: Math.ceil(fullAnswer.length / 4),
                llmModel: GROQ_MODEL
            }
        };

        yield { type: 'done' };
    }
}

export default new RAGService();