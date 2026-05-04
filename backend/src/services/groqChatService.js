import Groq from 'groq-sdk';
import vectorSearchService from './vectorSearchService.js';
import Chat from '../models/Chat.js';

let groq = null;

const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
};

const GROQ_MODEL = 'llama3-70b-8192';
const FALLBACK_MODEL = 'mixtral-8x7b-32768';

const SYSTEM_PROMPT = `You are OpsMind AI, a corporate knowledge assistant.

CRITICAL RULES:
1. You must ONLY answer using the provided SOP context below
2. If the answer is NOT in the context, respond EXACTLY with: "I don't know based on available company SOPs."
3. Do NOT make up information or hallucinate facts
4. ALWAYS include source citations in this format: (Source: Document Name, Page Number)
5. Be concise and professional

Context from company documents:
{CONTEXT}

Remember: If you cannot find the answer in the context above, say "I don't know based on available company SOPs."`;

class GroqChatService {
  async ask(question, userId, chatId = null) {
    try {
      const searchResult = await vectorSearchService.search(question, userId, {
        topK: 5,
        minSimilarity: 0.3,
        includeContext: true
      });

      if (!searchResult.success || !searchResult.context) {
        return {
          response: "I don't know based on available company SOPs.",
          sources: [],
          chatId: null
        };
      }

      const contextText = searchResult.context.chunks
        .map(chunk => {
          const docName = searchResult.results.find(r => r.chunkIndex === chunk.chunkIndex)?.documentName || 'Unknown';
          return `[Document: ${docName} | Page: ${chunk.pageNumber}]\n${chunk.text}`;
        })
        .join('\n\n');

      const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', contextText);

      const completion = await getGroqClient().chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 2048,
        top_p: 0.9,
        stream: false
      });

      const response = completion.choices[0]?.message?.content || "I don't know based on available company SOPs.";

      const sources = searchResult.results.map(r => ({
        documentId: r.documentId,
        filename: r.documentName,
        pageNumber: r.pageNumber,
        similarity: r.score
      }));

      let chat;
      if (chatId) {
        chat = await Chat.findById(chatId);
        if (chat && chat.userId === userId) {
          chat.messages.push(
            { role: 'user', content: question },
            { role: 'assistant', content: response, sources }
          );
          await chat.save();
        }
      } else {
        chat = await Chat.create({
          userId,
          messages: [
            { role: 'user', content: question },
            { role: 'assistant', content: response, sources }
          ]
        });
      }

      return {
        response,
        sources,
        chatId: chat._id
      };

    } catch (error) {
      console.error('Groq chat service error:', error);

      if (error.message.includes('rate_limit')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }

      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async askStream(question, userId, onChunk, chatId = null) {
    try {
      const searchResult = await vectorSearchService.search(question, userId, {
        topK: 5,
        minSimilarity: 0.3,
        includeContext: true
      });

      if (!searchResult.success || !searchResult.context) {
        const noAnswerMsg = "I don't know based on available company SOPs.";
        onChunk(noAnswerMsg);
        return {
          sources: [],
          chatId: null,
          fullResponse: noAnswerMsg
        };
      }

      const contextText = searchResult.context.chunks
        .map(chunk => {
          const docName = searchResult.results.find(r => r.chunkIndex === chunk.chunkIndex)?.documentName || 'Unknown';
          return `[Document: ${docName} | Page: ${chunk.pageNumber}]\n${chunk.text}`;
        })
        .join('\n\n');

      const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', contextText);

      const stream = await getGroqClient().chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 2048,
        top_p: 0.9,
        stream: true
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk(content);
        }
      }

      if (!fullResponse.trim()) {
        fullResponse = "I don't know based on available company SOPs.";
      }

      const sources = searchResult.results.map(r => ({
        documentId: r.documentId,
        filename: r.documentName,
        pageNumber: r.pageNumber,
        similarity: r.score
      }));

      let chat;
      if (chatId) {
        chat = await Chat.findById(chatId);
        if (chat && chat.userId === userId) {
          chat.messages.push(
            { role: 'user', content: question },
            { role: 'assistant', content: fullResponse, sources }
          );
          await chat.save();
        }
      } else {
        chat = await Chat.create({
          userId,
          messages: [
            { role: 'user', content: question },
            { role: 'assistant', content: fullResponse, sources }
          ]
        });
      }

      return {
        sources,
        chatId: chat._id,
        fullResponse
      };

    } catch (error) {
      console.error('Groq streaming service error:', error);

      if (error.message.includes('rate_limit')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }

      throw new Error(`Failed to generate streaming response: ${error.message}`);
    }
  }

  async getChatHistory(userId, limit = 20) {
    try {
      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select('_id title messages createdAt updatedAt');

      return chats;
    } catch (error) {
      console.error('Get chat history error:', error);
      throw new Error('Failed to retrieve chat history');
    }
  }

  async getChat(chatId, userId) {
    try {
      const chat = await Chat.findOne({ _id: chatId, userId });

      if (!chat) {
        throw new Error('Chat not found');
      }

      return chat;
    } catch (error) {
      console.error('Get chat error:', error);
      throw new Error('Failed to retrieve chat');
    }
  }

  async deleteChat(chatId, userId) {
    try {
      const result = await Chat.deleteOne({ _id: chatId, userId });

      if (result.deletedCount === 0) {
        throw new Error('Chat not found');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete chat error:', error);
      throw new Error('Failed to delete chat');
    }
  }
}

export default new GroqChatService();
