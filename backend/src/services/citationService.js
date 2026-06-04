export const generateCitations = (retrievedChunks, answerText = '') => {
    const citations = retrievedChunks.map((chunk, index) => {
        const docName = chunk.documentName || chunk.metadata?.documentName || 'Unknown Document';
        const pageNumber = chunk.pageNumber || 1;
        const sectionTitle = chunk.sectionTitle || null;
        const similarity = chunk.similarity || 0;

        // Build citation text
        let citationText = `According to ${docName} Page ${pageNumber}`;
        if (sectionTitle) {
            citationText += ` Section "${sectionTitle}"`;
        }
        citationText += ` (Similarity: ${(similarity * 100).toFixed(1)}%)`;

        // Extract a snippet from the chunk text for preview
        const snippet = extractSnippet(chunk.text, answerText);

        return {
            index: index + 1,
            documentId: chunk.documentId,
            documentName: docName,
            pageNumber,
            sectionTitle,
            similarityScore: similarity,
            similarityPercent: (similarity * 100).toFixed(1),
            citationText,
            snippet,
            chunkIndex: chunk.chunkIndex,
            startPosition: chunk.startPosition,
            endPosition: chunk.endPosition,
            fullText: chunk.text
        };
    });

    return citations;
};

const extractSnippet = (chunkText, answerText, maxLength = 200) => {
    // Try to find the most relevant part of the chunk that matches the answer
    if (!chunkText) return '';

    // Look for sentences that contain key terms from the answer
    const sentences = chunkText.split(/[.!?]\s+/);
    const answerWords = (answerText || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);

    let bestSentence = sentences[0] || chunkText.substring(0, maxLength);
    let bestScore = 0;

    for (const sentence of sentences) {
        const lowerSentence = sentence.toLowerCase();
        const score = answerWords.reduce((count, word) => {
            return count + (lowerSentence.includes(word) ? 1 : 0);
        }, 0);
        if (score > bestScore) {
            bestScore = score;
            bestSentence = sentence;
        }
    }

    const snippet = bestSentence.trim();
    return snippet.length > maxLength
        ? snippet.substring(0, maxLength) + '...'
        : snippet;
};

export const formatCitationForDisplay = (citation) => {
    return {
        label: `Ref ${citation.index}`,
        text: citation.citationText,
        source: {
            document: citation.documentName,
            page: citation.pageNumber,
            section: citation.sectionTitle,
            confidence: citation.similarityPercent + '%'
        },
        preview: citation.snippet
    };
};