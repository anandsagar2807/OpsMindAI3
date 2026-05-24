import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuthContext';
import { ragAPI, streamRAGResponse } from '../services/api';
import useChatStore from '../store/chatStore';

export const useAskQuestion = () => {
    const { getToken } = useAuth();
    const { addMessage, setCitations, setSources, setRetrievalMetadata } = useChatStore();

    return useMutation({
        mutationFn: async ({ query, conversationId }) => {
            const token = await getToken();
            const response = await ragAPI.ask(query, conversationId, token);
            return response.data;
        },
        onSuccess: (data) => {
            const assistantMessage = {
                id: data.message?._id || `msg-${Date.now()}`,
                role: 'assistant',
                content: data.answer || data.message?.content,
                citations: data.citations || data.message?.citations || [],
                sources: data.sources || [],
                retrievalMetadata: data.retrievalMetadata || data.metadata || null,
                createdAt: new Date().toISOString(),
            };
            addMessage(assistantMessage);
            setCitations(assistantMessage.citations);
            setSources(assistantMessage.sources);
            setRetrievalMetadata(assistantMessage.retrievalMetadata);
        },
    });
};

export const useStreamQuestion = () => {
    const { getToken } = useAuth();
    const {
        setIsStreaming, setStreamingContent, appendStreamingContent,
        setCitations, setSources, setRetrievalMetadata,
        finalizeStreaming, addMessage, setCurrentConversationId,
        currentConversationId, input,
    } = useChatStore();

    const streamQuestion = async (query, conversationId = null) => {
        const token = await getToken();
        const convId = conversationId || currentConversationId;

        // Add user message immediately
        const userMessage = {
            id: `msg-user-${Date.now()}`,
            role: 'user',
            content: query,
            createdAt: new Date().toISOString(),
        };
        addMessage(userMessage);

        // Start streaming
        setIsStreaming(true);
        setStreamingContent('');
        setCitations([]);
        setSources([]);
        setRetrievalMetadata(null);

        try {
            await streamRAGResponse(
                query,
                convId,
                token,
                // onMetadata
                (metadata) => {
                    setRetrievalMetadata(metadata);
                    if (metadata.citations) setCitations(metadata.citations);
                    if (metadata.sources) setSources(metadata.sources);
                    if (metadata.conversationId && !convId) {
                        setCurrentConversationId(metadata.conversationId);
                    }
                },
                // onContent
                (content) => {
                    appendStreamingContent(content);
                },
                // onComplete
                (data) => {
                    if (data.citations) setCitations(data.citations);
                    if (data.sources) setSources(data.sources);
                },
                // onError
                (error) => {
                    setIsStreaming(false);
                    setStreamingContent('');
                    const errorMessage = {
                        id: `msg-error-${Date.now()}`,
                        role: 'assistant',
                        content: `I encountered an error processing your question: ${error}. Please try again.`,
                        citations: [],
                        createdAt: new Date().toISOString(),
                    };
                    addMessage(errorMessage);
                }
            );

            // Finalize streaming - convert streaming content to a proper message
            return finalizeStreaming();
        } catch (error) {
            setIsStreaming(false);
            const errorMessage = {
                id: `msg-error-${Date.now()}`,
                role: 'assistant',
                content: `I encountered an error: ${error.message}. Please try again.`,
                citations: [],
                createdAt: new Date().toISOString(),
            };
            addMessage(errorMessage);
            return errorMessage;
        }
    };

    return { streamQuestion };
};

export const useSearchDocuments = () => {
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async ({ query, topK = 5 }) => {
            const token = await getToken();
            const response = await ragAPI.search(query, topK, token);
            return response.data;
        },
    });
};