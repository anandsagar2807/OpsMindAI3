import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuthContext';
import { chatAPI } from '../services/api';
import useChatStore from '../store/chatStore';

export const useConversations = (params = {}) => {
    const { getToken } = useAuth();
    const { setConversations, setIsLoadingHistory } = useChatStore();

    return useQuery({
        queryKey: ['conversations', params],
        queryFn: async () => {
            const token = await getToken();
            const response = await chatAPI.getAll(params, token);
            const list = Array.isArray(response.data.conversations)
                ? response.data.conversations
                : Array.isArray(response.data)
                    ? response.data
                    : [];
            setConversations(list);
            setIsLoadingHistory(false);
            return response.data;
        },
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
};

export const useConversation = (id) => {
    const { getToken } = useAuth();
    const { setMessages, setCurrentConversationId } = useChatStore();

    return useQuery({
        queryKey: ['conversation', id],
        queryFn: async () => {
            const token = await getToken();
            const response = await chatAPI.getOne(id, token);
            setMessages(response.data.messages || []);
            setCurrentConversationId(id);
            return response.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateConversation = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const { setCurrentConversationId } = useChatStore();

    return useMutation({
        mutationFn: async (title = 'New Conversation') => {
            const token = await getToken();
            const response = await chatAPI.create(title, token);
            return response.data;
        },
        onSuccess: (data) => {
            const conversation = data?.data || data?.conversation || data;
            const convId = conversation?._id || conversation?.id;
            if (convId) {
                setCurrentConversationId(convId);
            }
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

export const useUpdateConversationTitle = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, title }) => {
            const token = await getToken();
            const response = await chatAPI.updateTitle(id, title, token);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

export const useDeleteConversation = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();
    const { clearChat } = useChatStore();

    return useMutation({
        mutationFn: async (id) => {
            const token = await getToken();
            const response = await chatAPI.delete(id, token);
            return response.data;
        },
        onSuccess: (_, deletedId) => {
            const { currentConversationId } = useChatStore.getState();
            if (currentConversationId === deletedId) {
                clearChat();
            }
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};