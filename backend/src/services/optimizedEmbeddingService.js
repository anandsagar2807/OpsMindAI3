import simpleEmbeddingService from './simpleEmbeddingService.js';
import cacheService from './cacheService.js';

class OptimizedEmbeddingService {
  constructor() {
    this.provider = 'simple';
  }

  async generateEmbedding(text) {
    try {
      // Check cache first
      const cached = cacheService.getEmbedding(text);
      if (cached) {
        return cached;
      }

      // Generate new embedding
      const embedding = await simpleEmbeddingService.generateEmbedding(text);

      // Cache the result
      cacheService.setEmbedding(text, embedding);

      return embedding;
    } catch (error) {
      console.error('Optimized embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(texts) {
    const embeddings = [];
    const uncachedTexts = [];
    const uncachedIndices = [];

    // Check cache for each text
    for (let i = 0; i < texts.length; i++) {
      const cached = cacheService.getEmbedding(texts[i]);
      if (cached) {
        embeddings[i] = cached;
      } else {
        uncachedTexts.push(texts[i]);
        uncachedIndices.push(i);
      }
    }

    // Generate embeddings for uncached texts
    if (uncachedTexts.length > 0) {
      const newEmbeddings = await simpleEmbeddingService.generateBatchEmbeddings(uncachedTexts);

      // Cache and insert new embeddings
      for (let i = 0; i < uncachedTexts.length; i++) {
        const embedding = newEmbeddings[i];
        cacheService.setEmbedding(uncachedTexts[i], embedding);
        embeddings[uncachedIndices[i]] = embedding;
      }
    }

    return embeddings;
  }

  clearCache() {
    cacheService.clearEmbeddings();
  }
}

export default new OptimizedEmbeddingService();
