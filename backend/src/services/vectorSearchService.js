import SOPChunk from '../models/SOPChunk.js';
import Document from '../models/Document.js';
import embeddingService from './embeddingService.js';

const SIMILARITY_THRESHOLD = 0.3;
const TOP_K_RESULTS = 5;

class VectorSearchService {
  async searchSimilarChunks(queryEmbedding, userId, topK = TOP_K_RESULTS) {
    try {
      const results = await SOPChunk.aggregate([
        {
          $match: {
            userId: userId,
            embedding: { $ne: null }
          }
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

  async search(query, userId, options = {}) {
    const startTime = Date.now();

    try {
      const { topK = TOP_K_RESULTS, minSimilarity = SIMILARITY_THRESHOLD } = options;

      const queryEmbedding = await embeddingService.generateEmbedding(query);
      const chunks = await this.searchSimilarChunks(queryEmbedding, userId, topK);

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
            queryTokens: Math.ceil(query.length / 4)
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
          avgSimilarity: chunks.reduce((sum, c) => sum + c.similarity, 0) / chunks.length
        }
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
}

export default new VectorSearchService();
