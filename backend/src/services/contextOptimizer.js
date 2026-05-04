class ContextOptimizer {
  constructor(maxTokens = 3000) {
    this.maxTokens = maxTokens;
    this.avgCharsPerToken = 4;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / this.avgCharsPerToken);
  }

  removeDuplicates(chunks) {
    const seen = new Set();
    return chunks.filter(chunk => {
      const normalized = chunk.text.trim().toLowerCase();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  mergeAdjacentChunks(chunks) {
    if (chunks.length === 0) return [];

    const sortedChunks = [...chunks].sort((a, b) => {
      if (a.documentId.toString() !== b.documentId.toString()) {
        return a.documentId.toString().localeCompare(b.documentId.toString());
      }
      if (a.pageNumber !== b.pageNumber) {
        return a.pageNumber - b.pageNumber;
      }
      return a.chunkIndex - b.chunkIndex;
    });

    const merged = [];
    let current = { ...sortedChunks[0] };

    for (let i = 1; i < sortedChunks.length; i++) {
      const next = sortedChunks[i];

      const isSameDocument = current.documentId.toString() === next.documentId.toString();
      const isSamePage = current.pageNumber === next.pageNumber;
      const isAdjacent = next.chunkIndex === current.chunkIndex + 1;

      if (isSameDocument && isSamePage && isAdjacent) {
        current.text = current.text + '\n' + next.text;
        current.similarity = Math.max(current.similarity, next.similarity);
      } else {
        merged.push(current);
        current = { ...next };
      }
    }
    merged.push(current);

    return merged;
  }

  optimizeForTokenLimit(chunks) {
    let optimized = [];
    let currentTokens = 0;

    for (const chunk of chunks) {
      const chunkTokens = this.estimateTokens(chunk.text);

      if (currentTokens + chunkTokens <= this.maxTokens) {
        optimized.push(chunk);
        currentTokens += chunkTokens;
      } else {
        break;
      }
    }

    return optimized;
  }

  buildContextWindow(chunks, documents) {
    const deduplicated = this.removeDuplicates(chunks);
    const merged = this.mergeAdjacentChunks(deduplicated);
    const optimized = this.optimizeForTokenLimit(merged);

    const contextParts = optimized.map(chunk => {
      const doc = documents.find(d => d._id.toString() === chunk.documentId.toString());
      const docName = doc?.filename || 'Unknown Document';

      return `[${docName} - Page ${chunk.pageNumber}]\n${chunk.text}`;
    });

    const context = contextParts.join('\n\n---\n\n');
    const totalTokens = this.estimateTokens(context);

    return {
      context,
      chunksUsed: optimized.length,
      totalTokens,
      chunks: optimized
    };
  }

  formatForLLM(contextWindow, query) {
    return {
      systemPrompt: `You are OpsMind AI, an intelligent assistant that helps users find information from their corporate documents.

You have access to the following context from the user's documents:

${contextWindow.context}

Instructions:
- Answer the user's question based ONLY on the provided context
- Be concise and accurate
- If the context doesn't contain enough information to answer the question, say so clearly
- Cite specific documents and page numbers when relevant
- Use a professional and helpful tone
- Do not make up information or hallucinate facts`,
      userPrompt: query,
      metadata: {
        chunksUsed: contextWindow.chunksUsed,
        totalTokens: contextWindow.totalTokens
      }
    };
  }
}

export default new ContextOptimizer();
