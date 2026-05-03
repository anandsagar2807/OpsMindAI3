import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

class EmbeddingService {
  constructor() {
    this.provider = process.env.EMBEDDING_PROVIDER || 'gemini';

    if (this.provider === 'gemini') {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    } else if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  async generateEmbedding(text) {
    try {
      if (this.provider === 'gemini') {
        return await this.generateGeminiEmbedding(text);
      } else if (this.provider === 'openai') {
        return await this.generateOpenAIEmbedding(text);
      } else {
        throw new Error('Invalid embedding provider');
      }
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateGeminiEmbedding(text) {
    const model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  async generateOpenAIEmbedding(text) {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async generateBatchEmbeddings(texts) {
    const embeddings = [];

    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return embeddings;
  }
}

export default new EmbeddingService();
