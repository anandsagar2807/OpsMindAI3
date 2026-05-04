import NodeCache from 'node-cache';

// Cache for embeddings (TTL: 1 hour)
const embeddingCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600,
  useClones: false
});

// Cache for vector search results (TTL: 5 minutes)
const searchCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

// Cache for document metadata (TTL: 30 minutes)
const documentCache = new NodeCache({
  stdTTL: 1800,
  checkperiod: 300,
  useClones: false
});

class CacheService {
  // Embedding cache
  getEmbedding(text) {
    const key = this.generateKey(text);
    return embeddingCache.get(key);
  }

  setEmbedding(text, embedding) {
    const key = this.generateKey(text);
    return embeddingCache.set(key, embedding);
  }

  // Search cache
  getSearchResult(query, userId) {
    const key = `search:${userId}:${this.generateKey(query)}`;
    return searchCache.get(key);
  }

  setSearchResult(query, userId, result) {
    const key = `search:${userId}:${this.generateKey(query)}`;
    return searchCache.set(key, result);
  }

  // Document cache
  getDocument(documentId) {
    const key = `doc:${documentId}`;
    return documentCache.get(key);
  }

  setDocument(documentId, document) {
    const key = `doc:${documentId}`;
    return documentCache.set(key, document);
  }

  invalidateDocument(documentId) {
    const key = `doc:${documentId}`;
    return documentCache.del(key);
  }

  // Utility
  generateKey(text) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest('hex');
  }

  // Stats
  getStats() {
    return {
      embeddings: embeddingCache.getStats(),
      searches: searchCache.getStats(),
      documents: documentCache.getStats()
    };
  }

  // Clear all caches
  clearAll() {
    embeddingCache.flushAll();
    searchCache.flushAll();
    documentCache.flushAll();
  }

  // Clear specific cache
  clearEmbeddings() {
    embeddingCache.flushAll();
  }

  clearSearches() {
    searchCache.flushAll();
  }

  clearDocuments() {
    documentCache.flushAll();
  }
}

export default new CacheService();
