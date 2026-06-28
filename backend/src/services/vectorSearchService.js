import SOPChunk from '../models/SOPChunk.js';
import Document from '../models/Document.js';
import embeddingService from './embeddingService.js';

const SIMILARITY_THRESHOLD = 0.3;
const TOP_K_RESULTS = 5;

class VectorSearchService {
  async searchSimilarChunks(queryEmbedding, userId, topK = TOP_K_RESULTS, documentId = null) {
    try {
      const matchStage = {
        userId: userId,
        embedding: { $ne: null }
      };
      // When a documentId is provided, scope the search to chunks belonging
      // to that single document only.
      if (documentId) {
        matchStage.documentId = documentId;
      }

      const results = await SOPChunk.aggregate([
        {
          $match: matchStage
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
                  },
                  normA: {
                    $sqrt: {
                      $reduce: {
                        input: { $range: [0, { $size: '$embedding' }] },
                        initialValue: 0,
                        in: {
                          $add: [
                            '$$value',
                            {
                              $multiply: [
                                { $arrayElemAt: ['$embedding', '$$this'] },
                                { $arrayElemAt: ['$embedding', '$$this'] }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  },
                  normB: {
                    $sqrt: {
                      $reduce: {
                        input: { $range: [0, { $size: { $literal: queryEmbedding } }] },
                        initialValue: 0,
                        in: {
                          $add: [
                            '$$value',
                            {
                              $multiply: [
                                { $arrayElemAt: [{ $literal: queryEmbedding }, '$$this'] },
                                { $arrayElemAt: [{ $literal: queryEmbedding }, '$$this'] }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
                },
                in: {
                  $cond: {
                    if: { $gt: [{ $multiply: ['$$normA', '$$normB'] }, 0] },
                    then: { $divide: ['$$dotProduct', { $multiply: ['$$normA', '$$normB'] }] },
                    else: 0
                  }
                }
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
            sectionTitle: 1,
            similarity: 1,
            metadata: 1,
            startPosition: 1,
            endPosition: 1
          }
        }
      ]);

      return results;
    } catch (error) {
      console.error('Vector search error:', error);
      throw new Error('Failed to perform vector search: ' + error.message);
    }
  }

  /**
   * Keyword-based fallback search used when embeddings are unavailable
   * (e.g. OpenRouter free tier has no embedding credits). Performs a
   * case-insensitive regex search over chunk text for the query's keywords
   * and ranks results by the number of keyword matches. Requires no vector
   * embeddings and no special text index.
   */
  async searchByKeywords(query, userId, topK = TOP_K_RESULTS, documentId = null) {
    try {
      // Extract meaningful keywords (length > 2, ignore common stopwords)
      const stopwords = new Set([
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can',
        'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'from', 'this',
        'that', 'with', 'what', 'when', 'how', 'why', 'who', 'will', 'your',
        'the', 'into', 'than', 'them', 'then', 'they', 'their', 'there', 'where',
        'which', 'whom', 'his', 'she', 'him', 'its', 'about', 'would', 'should',
        'could', 'does', 'did', 'has', 'been', 'being', 'were', 'more', 'most',
        'some', 'such', 'only', 'own', 'same', 'too', 'very', 'just', 'also'
      ]);
      const keywords = query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(w => w.length > 2 && !stopwords.has(w))
        .slice(0, 12);

      if (keywords.length === 0) {
        return [];
      }

      // Build a case-insensitive regex that matches any keyword (OR)
      const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const regex = new RegExp(escaped.join('|'), 'i');

      const matchStage = { userId, text: { $regex: regex } };
      if (documentId) {
        matchStage.documentId = documentId;
      }

      const chunks = await SOPChunk.find(matchStage)
        .sort({ chunkIndex: 1 })
        .limit(topK * 4)
        .lean();

      // Score each chunk by counting how many distinct keywords it contains
      const scored = chunks.map(chunk => {
        const lowerText = (chunk.text || '').toLowerCase();
        let matchCount = 0;
        for (const kw of keywords) {
          if (lowerText.includes(kw)) matchCount += 1;
        }
        return { ...chunk, similarity: matchCount / keywords.length };
      });

      // Keep only chunks with at least one keyword match, sorted by relevance
      const filtered = scored
        .filter(c => c.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

      return filtered;
    } catch (error) {
      console.error('Keyword search error:', error);
      throw new Error('Failed to perform keyword search: ' + error.message);
    }
  }

  async search(query, userId, options = {}) {
    const startTime = Date.now();

    const { topK = TOP_K_RESULTS, minSimilarity = SIMILARITY_THRESHOLD, documentId = null } = options;

    // Attempt vector (semantic) search first. If embeddings are unavailable
    // (e.g. OpenRouter free tier has no embedding credits, 402), gracefully
    // fall back to keyword-based search so the chat still returns grounded
    // answers from the user's uploaded SOP documents.
    let chunks = [];
    let searchMode = 'vector';

    try {
      const queryEmbedding = await embeddingService.generateEmbedding(query);
      // Forward documentId so the search can be scoped to a single document
      // when the user enters chat via "Chat with this document".
      chunks = await this.searchSimilarChunks(queryEmbedding, userId, topK, documentId);
    } catch (embeddingError) {
      console.warn('⚠️  [vectorSearch] Embedding unavailable, falling back to keyword search:', embeddingError.message);
      searchMode = 'keyword';
      try {
        chunks = await this.searchByKeywords(query, userId, topK, documentId);
      } catch (keywordError) {
        console.error('Keyword fallback search error:', keywordError);
        throw keywordError;
      }
    }

    const retrievalTimeMs = Date.now() - startTime;

    if (chunks.length === 0) {
      const userDocCount = await Document.countDocuments({
        uploadedBy: userId,
        status: 'completed'
      });

      return {
        success: false,
        message: userDocCount === 0
          ? "No documents found in your knowledge base. Please upload SOP documents first."
          : "No relevant information found in your uploaded SOP documents. Try rephrasing your question or upload more documents.",
        results: [],
        context: null,
        metadata: {
          totalChunks: 0,
          documentsSearched: userDocCount,
          retrievalTimeMs,
          queryTokens: Math.ceil(query.length / 4),
          searchMode
        }
      };
    }

    // Build context from retrieved chunks
    const context = chunks.map(chunk => ({
      text: chunk.text,
      source: chunk.metadata?.documentName || 'Unknown Document',
      pageNumber: chunk.pageNumber,
      sectionTitle: chunk.sectionTitle,
      similarity: chunk.similarity,
      chunkIndex: chunk.chunkIndex
    }));

    // Enrich with document names
    const documentIds = [...new Set(chunks.map(c => c.documentId))];
    const documents = await Document.find({ _id: { $in: documentIds } });

    const enrichedResults = chunks.map(chunk => {
      const doc = documents.find(d => d._id.toString() === chunk.documentId.toString());
      return {
        ...chunk,
        documentName: doc?.originalName || doc?.name || chunk.metadata?.documentName || 'Unknown',
        documentId: chunk.documentId
      };
    });

    return {
      success: true,
      results: enrichedResults,
      context,
      metadata: {
        totalChunks: chunks.length,
        documentsSearched: documents.length,
        retrievalTimeMs,
        queryTokens: Math.ceil(query.length / 4),
        topSimilarity: chunks[0]?.similarity || 0,
        avgSimilarity: chunks.reduce((sum, c) => sum + c.similarity, 0) / chunks.length,
        searchMode
      }
    };
  }
}

export default new VectorSearchService();
