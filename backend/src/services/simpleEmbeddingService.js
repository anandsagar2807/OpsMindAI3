class SimpleEmbeddingService {
  constructor() {
    this.provider = 'simple';
  }

  // Simple text-to-vector using character frequency
  async generateEmbedding(text) {
    try {
      // Create a simple 384-dimensional vector based on text features
      const vector = new Array(384).fill(0);

      // Normalize text
      const normalized = text.toLowerCase().trim();

      // Use character codes and word features to create a simple embedding
      for (let i = 0; i < normalized.length && i < 384; i++) {
        vector[i] = normalized.charCodeAt(i) / 255;
      }

      // Add word count features
      const words = normalized.split(/\s+/);
      vector[0] = words.length / 100;

      // Add character type features
      vector[1] = (normalized.match(/[a-z]/g) || []).length / normalized.length;
      vector[2] = (normalized.match(/[0-9]/g) || []).length / normalized.length;

      // Normalize vector
      const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
      return vector.map(val => magnitude > 0 ? val / magnitude : 0);

    } catch (error) {
      console.error('Simple embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(texts) {
    const embeddings = [];
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }
}

export default new SimpleEmbeddingService();
