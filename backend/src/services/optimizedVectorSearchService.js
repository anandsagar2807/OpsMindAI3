import Vector from '../models/Vector.js';
import Document from '../models/Document.js';
import optimizedEmbeddingService from './optimizedEmbeddingService.js';
import contextOptimizer from './contextOptimizer.js';
import cacheService from './cacheService.js';

const SIMILARITY_THRESHOLD = 0.3;
const TOP_K_RESULTS = 5;

class OptimizedVectorSearchService {
  async searchSimilarChunks(queryEmbedding, userId, topK = TOP_K_RESULTS) {
    try {
      // Use MongoDB aggregation with optimized pipeline
      const results = await Vector.aggregate([
        {
          $match: { userId: userId }
        },
        {
          $addFields: {
            similarity: {
              $let: {
                vars: {
                  dotProduct: {
                    $reduce: {
                      input: { $range: [0, { $size: '$embedding' }] },
                      initialValue: 0,
                      in: {
                        $add: [
                          '$$value',
                          {
                            $multiply: [
                              { $arrayElemAt: ['$embedding', '$$this'] },
                              { $arrayElemAt: [queryEmbedding, '$$this'] }
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                in: '$$dotProduct'
              }
            }
          }
        },
        {
          $match: {
            similarity: { $gte: SIMILARITY_THRESHOLD }
          }
        },
        {
          $sort: { similarity: -1 }
        },
        {
          $limit: topK
        },
        {
          $project: {
            documentId: 1,
            text: 1,
            pageNumber: 1,
            chunkIndex: 1,
            similarity: 1,
            metadata: 1
          }
        }
      ]).allowDiskUse(true); // Allow disk use for large datasets

      return results;
    } catch (error) {
      console.error('Vector search error:', error);
      throw new Error('Failed to perform vector search');
    }
  }

  async search(query, userId, options = {}) {
    try {
      const {
        topK = TOP_K_RESULTS,
        minSimilarity = SIMILARITY_THRESHOLD,
        includeContext = true
      } = options;

      // Check cache first
      const cacheKey = `${query}:${topK}:${minSimilarity}`;
      const cached = cacheService.getSearchResult(cacheKey, userId);
      if (cached) {
        return cached;
      }

      // Generate query embedding with caching
      const queryEmbedding = await optimizedEmbeddingService.generateEmbedding(query);

      // Perform vector search
      const chunks = await this.searchSimilarChunks(queryEmbedding, userId, topK);

      if (chunks.length === 0) {
        const userDocCount = await Document.countDocuments({ uploadedBy: userId });

        const result = {
          success: false,
          message: userDocCount === 0
            ? "No documents found in your knowledge base. Please upload documents first."
            : "No relevant information found. Try rephrasing your question or upload more documents.",
          results: [],
          context: null,
          metadata: {
            totalChunks: 0,
            documentsSearched: userDocCount,
            queryTokens: contextOptimizer.estimateTokens(query)
          }
        };

        return result;
      }

      // Filter by similarity threshold
      const belowThreshold = chunks.filter(c => c.similarity < minSimilarity);
      if (belowThreshold.length === chunks.length) {
        return {
          success: false,
          message: "No relevant policy found. The similarity scores are too low to provide a confident answer.",
          results: chunks.map(chunk => ({
            text: chunk.text,
            score: chunk.similarity,
            pageNumber: chunk.pageNumber,
            documentId: chunk.documentId,
            chunkIndex: chunk.chunkIndex,
            belowThreshold: true
          })),
          context: null,
          metadata: {
            totalChunks: chunks.length,
            maxSimilarity: Math.max(...chunks.map(c => c.similarity)),
            threshold: minSimilarity
          }
        };
      }

      // Fetch documents with caching
      const documentIds = [...new Set(chunks.map(c => c.documentId))];
      const documents = await this.getDocumentsWithCache(documentIds);

      // Build results
      const results = chunks.map(chunk => {
        const doc = documents.find(d => d._id.toString() === chunk.documentId.toString());
        return {
          text: chunk.text,
          score: chunk.similarity,
          pageNumber: chunk.pageNumber,
          documentName: doc?.filename || 'Unknown',
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex,
          metadata: chunk.metadata
        };
      });

      // Build context window
      let contextWindow = null;
      if (includeContext) {
        contextWindow = contextOptimizer.buildContextWindow(chunks, documents);
      }

      const result = {
        success: true,
        message: `Found ${results.length} relevant chunks from ${documentIds.length} documents`,
        results,
        context: contextWindow,
        metadata: {
          totalChunks: chunks.length,
          documentsSearched: documentIds.length,
          avgSimilarity: chunks.reduce((sum, c) => sum + c.similarity, 0) / chunks.length,
          maxSimilarity: Math.max(...chunks.map(c => c.similarity)),
          minSimilarity: Math.min(...chunks.map(c => c.similarity))
        }
      };

      // Cache the result
      cacheService.setSearchResult(cacheKey, userId, result);

      return result;

    } catch (error) {
      console.error('Search service error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async getDocumentsWithCache(documentIds) {
    const documents = [];
    const uncachedIds = [];

    // Check cache for each document
    for (const id of documentIds) {
      const cached = cacheService.getDocument(id.toString());
      if (cached) {
        documents.push(cached);
      } else {
        uncachedIds.push(id);
      }
    }

    // Fetch uncached documents
    if (uncachedIds.length > 0) {
      const fetchedDocs = await Document.find({ _id: { $in: uncachedIds } })
        .select('_id filename uploadedBy status createdAt')
        .lean();

      // Cache and add to results
      for (const doc of fetchedDocs) {
        cacheService.setDocument(doc._id.toString(), doc);
        documents.push(doc);
      }
    }

    return documents;
  }

  async searchWithLLMContext(query, userId) {
    const searchResult = await this.search(query, userId, { includeContext: true });

    if (!searchResult.success || !searchResult.context) {
      return searchResult;
    }

    const llmPrompt = contextOptimizer.formatForLLM(searchResult.context, query);

    return {
      ...searchResult,
      llmPrompt
    };
  }

  clearCache() {
    cacheService.clearSearches();
    cacheService.clearDocuments();
  }
}

export default new OptimizedVectorSearchService();
