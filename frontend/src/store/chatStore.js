import { create } from 'zustand';

const useChatStore = create((set, get) => ({
    // Current conversation
    currentConversationId: null,
    messages: [],
    input: '',
    isStreaming: false,
    streamingContent: '',
    citations: [],
    sources: [],
    retrievalMetadata: null,

    // Chat history sidebar
    conversations: [],
    searchQuery: '',
    isLoadingHistory: false,

    // Actions
    setInput: (input) => set({ input }),
    setCurrentConversationId: (id) => set({ currentConversationId: id }),
    setMessages: (messages) => set({ messages }),
    setConversations: (conversations) => set({ conversations }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    setStreamingContent: (content) => set({ streamingContent: content }),
    setCitations: (citations) => set({ citations }),
    setSources: (sources) => set({ sources }),
    setRetrievalMetadata: (metadata) => set({ retrievalMetadata: metadata }),
    setIsLoadingHistory: (loading) => set({ isLoadingHistory: loading }),

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    appendStreamingContent: (chunk) => set((state) => ({
        streamingContent: state.streamingContent + chunk
    })),

    finalizeStreaming: () => {
        const state = get();
        const assistantMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: state.streamingContent,
            citations: state.citations,
            sources: state.sources,
            retrievalMetadata: state.retrievalMetadata,
            createdAt: new Date().toISOString()
        };
        set({
            messages: [...state.messages, assistantMessage],
            isStreaming: false,
            streamingContent: '',
        });
        return assistantMessage;
    },

    clearChat: () => set({
        currentConversationId: null,
        messages: [],
        input: '',
        isStreaming: false,
        streamingContent: '',
        citations: [],
        sources: [],
        retrievalMetadata: null,
    }),

    getFilteredConversations: () => {
        const { conversations, searchQuery } = get();
        const list = Array.isArray(conversations) ? conversations : [];
        if (!searchQuery) return list;
        return list.filter(c =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },
}));

export default useChatStore;