import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

class EmbeddingService {
  constructor() {
    this.model = 'embedding-001';
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your-gemini-api-key-here') {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    } else {
      this.genAI = null;
      console.warn('⚠️  [embeddingService] GEMINI_API_KEY is a placeholder — embedding features will be unavailable until a valid key is provided.');
      console.warn('⚠️  [embeddingService] Get your key from https://aistudio.google.com');
    }
  }

  async generateEmbedding(text) {
    if (!this.genAI) {
      throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in .env to enable embeddings.');
    }
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding: ' + error.message);
    }
  }

  async generateBatchEmbeddings(texts) {
    const embeddings = [];
    for (let i = 0; i < texts.length; i++) {
      const embedding = await this.generateEmbedding(texts[i]);
      embeddings.push(embedding);

      // Rate limiting: pause between requests
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    return embeddings;
  }
}

export default new EmbeddingService();
