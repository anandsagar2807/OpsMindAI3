const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_EMBEDDING_MODEL = process.env.OPENROUTER_EMBEDDING_MODEL || 'openai/text-embedding-3-small';

class EmbeddingService {
  constructor() {
    this.model = OPENROUTER_EMBEDDING_MODEL;
    if (!OPENROUTER_API_KEY) {
      this.apiKey = null;
      console.warn('⚠️  [embeddingService] OPENROUTER_API_KEY is not configured — embedding features will be unavailable.');
    } else {
      this.apiKey = OPENROUTER_API_KEY;
      console.log(`✅ [embeddingService] Using OpenRouter embedding model: ${this.model}`);
    }
  }

  async generateEmbedding(text) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured. Set OPENROUTER_API_KEY in .env to enable embeddings.');
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error('Cannot generate embedding for empty text.');
    }

    try {
      const resp = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'https://frontend-amber-six-35.vercel.app',
          'X-Title': 'OpsMind AI'
        },
        body: JSON.stringify({
          model: this.model,
          input: trimmedText
        })
      });

      if (!resp.ok) {
        const errBody = await resp.text();
        throw new Error(`OpenRouter embeddings API error (${resp.status}): ${errBody}`);
      }

      const data = await resp.json();
      const embedding = data?.data?.[0]?.embedding;

      if (!embedding || !Array.isArray(embedding)) {
        throw new Error('Invalid embedding response from OpenRouter — missing embedding array.');
      }

      return embedding;
    } catch (error) {
      console.error('[embeddingService] Embedding generation error:', error.message);
      throw new Error('Failed to generate embedding: ' + error.message);
    }
  }

  async generateBatchEmbeddings(texts) {
    if (!Array.isArray(texts) || texts.length === 0) {
      return [];
    }

    const embeddings = [];
    for (let i = 0; i < texts.length; i++) {
      const embedding = await this.generateEmbedding(texts[i]);
      embeddings.push(embedding);

      // Rate limiting: pause between requests to avoid hitting rate limits
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    return embeddings;
  }
}

export default new EmbeddingService();
