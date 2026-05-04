import Groq from 'groq-sdk';
import Vector from '../models/Vector.js';
import Document from '../models/Document.js';
import simpleEmbeddingService from './simpleEmbeddingService.js';

let groq = null;

const getGroqClient = () => {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
};

const GROQ_MODEL = 'llama-3.1-70b-versatile';

export const generateChatResponse = async (query, userId) => {
  try {
    const queryEmbedding = await simpleEmbeddingService.generateEmbedding(query);

    const relevantChunks = await Vector.aggregate([
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
      { $match: { userId: userId } },
      { $sort: { similarity: -1 } },
      { $limit: 5 }
    ]);

    if (relevantChunks.length === 0) {
      // Check if user has any documents at all
      let userDocumentCount = 0;
      try {
        userDocumentCount = await Document.countDocuments({ uploadedBy: userId });
      } catch (error) {
        // If userId is not a valid ObjectId (e.g., "temp-user-id"), assume no documents
        console.log('Note: userId is not a valid ObjectId, assuming no documents:', userId);
        userDocumentCount = 0;
      }

      if (userDocumentCount === 0) {
        return {
          response: "I don't have any documents in your knowledge base yet. To get started, please upload some documents first. You can upload PDF files from the 'Upload' page in the dashboard.",
          sources: []
        };
      } else {
        return {
          response: "I couldn't find relevant information in your documents to answer this question. Try asking about different topics or upload more documents that might contain this information.",
          sources: []
        };
      }
    }

    const documentIds = [...new Set(relevantChunks.map(chunk => chunk.documentId))];
    const documents = await Document.find({ _id: { $in: documentIds } });
    const docMap = {};
    documents.forEach(doc => {
      docMap[doc._id.toString()] = doc;
    });

    const context = relevantChunks
      .map(chunk => {
        const doc = docMap[chunk.documentId.toString()];
        return `[From ${doc?.filename || 'Unknown'}, Page ${chunk.pageNumber}]\n${chunk.text}`;
      })
      .join('\n\n');

    const systemPrompt = `You are OpsMind AI, an intelligent assistant that helps users find information from their corporate documents.
You have access to the following context from the user's documents:

${context}

Instructions:
- Answer the user's question based ONLY on the provided context
- Be concise and accurate
- If the context doesn't contain enough information to answer the question, say so
- Cite specific documents and page numbers when relevant
- Use a professional and helpful tone`;

    const completion = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

    const sources = relevantChunks.map(chunk => {
      const doc = docMap[chunk.documentId.toString()];
      return {
        documentId: chunk.documentId,
        filename: doc?.filename || 'Unknown',
        pageNumber: chunk.pageNumber,
        similarity: chunk.similarity
      };
    });

    return {
      response,
      sources
    };

  } catch (error) {
    console.error('Chat service error:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};

export const generateStreamingResponse = async (query, userId, onChunk) => {
  try {
    const queryEmbedding = await simpleEmbeddingService.generateEmbedding(query);

    const relevantChunks = await Vector.aggregate([
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
      { $match: { userId: userId } },
      { $sort: { similarity: -1 } },
      { $limit: 5 }
    ]);

    if (relevantChunks.length === 0) {
      // Check if user has any documents at all
      let userDocumentCount = 0;
      try {
        userDocumentCount = await Document.countDocuments({ uploadedBy: userId });
      } catch (error) {
        // If userId is not a valid ObjectId (e.g., "temp-user-id"), assume no documents
        console.log('Note: userId is not a valid ObjectId, assuming no documents:', userId);
        userDocumentCount = 0;
      }

      if (userDocumentCount === 0) {
        onChunk("I don't have any documents in your knowledge base yet. To get started, please upload some documents first. You can upload PDF files from the 'Upload' page in the dashboard.");
      } else {
        onChunk("I couldn't find relevant information in your documents to answer this question. Try asking about different topics or upload more documents that might contain this information.");
      }
      return { sources: [] };
    }

    const documentIds = [...new Set(relevantChunks.map(chunk => chunk.documentId))];
    const documents = await Document.find({ _id: { $in: documentIds } });
    const docMap = {};
    documents.forEach(doc => {
      docMap[doc._id.toString()] = doc;
    });

    const context = relevantChunks
      .map(chunk => {
        const doc = docMap[chunk.documentId.toString()];
        return `[From ${doc?.filename || 'Unknown'}, Page ${chunk.pageNumber}]\n${chunk.text}`;
      })
      .join('\n\n');

    const systemPrompt = `You are OpsMind AI, an intelligent assistant that helps users find information from their corporate documents.
You have access to the following context from the user's documents:

${context}

Instructions:
- Answer the user's question based ONLY on the provided context
- Be concise and accurate
- If the context doesn't contain enough information to answer the question, say so
- Cite specific documents and page numbers when relevant
- Use a professional and helpful tone`;

    const stream = await getGroqClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }

    const sources = relevantChunks.map(chunk => {
      const doc = docMap[chunk.documentId.toString()];
      return {
        documentId: chunk.documentId,
        filename: doc?.filename || 'Unknown',
        pageNumber: chunk.pageNumber,
        similarity: chunk.similarity
      };
    });

    return { sources };

  } catch (error) {
    console.error('Streaming chat service error:', error);
    throw new Error(`Failed to generate streaming response: ${error.message}`);
  }
};
