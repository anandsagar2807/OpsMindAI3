import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Square, Bot, Sparkles, Loader2, Copy,
    RotateCcw, BookOpen, ChevronDown, AlertTriangle,
    FileText, Search, Zap, User
} from 'lucide-react';
import useChatStore from '../../store/chatStore';
import useUIStore from '../../store/uiStore';
import { useStreamQuestion } from '../../hooks/useRAG';
import { useCreateConversation } from '../../hooks/useChat';
import ScrollArea from '../ui/ScrollArea';
import CitationDisplay from './CitationDisplay';

const ChatPanel = () => {
    const {
        messages, input, isStreaming, streamingContent,
        setInput, setIsStreaming, clearChat,
        currentConversationId, citations, sources, retrievalMetadata,
        addMessage, finalizeStreaming,
        setStreamingContent, appendStreamingContent,
        setCitations, setSources, setRetrievalMetadata,
        setCurrentConversationId,
    } = useChatStore();
    const { uploadPanelOpen, setUploadPanelOpen, sourceInspectorOpen, setSourceInspectorOpen, setSelectedSource } = useUIStore();
    const { streamQuestion } = useStreamQuestion();
    const createConversation = useCreateConversation();

    const [abortRef, setAbortRef] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-focus input on mount
    useEffect(() => {
        if (inputRef.current && !isStreaming) {
            inputRef.current.focus();
        }
    }, []);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages, streamingContent]);

    const handleSend = async () => {
        const query = input.trim();
        if (!query || isStreaming) return;

        setInput('');

        // If no conversation exists, create one first
        let convId = currentConversationId;
        if (!convId) {
            try {
                const result = await createConversation.mutateAsync(query.slice(0, 50));
                convId = result.conversation?._id || result.conversation?.id || result._id || result.id;
                setCurrentConversationId(convId);
            } catch (err) {
                toast.error('Failed to create conversation');
                return;
            }
        }

        // Stream the RAG response
        setAbortRef(new AbortController());
        await streamQuestion(query, convId);
    };

    const handleStop = () => {
        if (abortRef) {
            abortRef.abort();
            setAbortRef(null);
        }
        setIsStreaming(false);
        finalizeStreaming();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRetry = () => {
        const lastUserMsg = messages.filter(m => m.role === 'user').pop();
        if (lastUserMsg) {
            setInput(lastUserMsg.content);
        }
    };

    const formatMessageContent = (content) => {
        // Simple markdown-like formatting
        return content
            .replace(/```([\s\S]*?)```/g, '<code class="bg-white/5 px-1 py-0.5 rounded text-cyan-300 text-xs">$1</code>')
            .replace(/`([^`]+)`/g, '<code class="bg-white/5 px-1 rounded text-cyan-300">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em class="text-gray-300">$1</em>')
            .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-3 mb-1">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-white mt-2 mb-1">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-1">$1</h1>')
            .replace(/\n/g, '<br/>');
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.role === 'user';
        const isLast = index === messages.length - 1;
        const isStreamingMsg = isLast && isStreaming && !isUser;

        return (
            <motion.div
                key={msg.id || `msg-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isUser
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                    }`}>
                    {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                </div>

                {/* Message bubble */}
                <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-white'
                        : 'bg-white/5 border border-white/10 text-gray-200'
                        }`}>
                        {isStreamingMsg ? (
                            <div className="whitespace-pre-wrap">
                                {formatMessageContent(streamingContent)}
                                {isStreaming && (
                                    <span className="inline-flex items-center gap-1 ml-1">
                                        <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                                __html: formatMessageContent(msg.content || '')
                            }} />
                        )}
                    </div>

                    {/* Citations for completed assistant messages */}
                    {!isStreamingMsg && !isUser && msg.citations && msg.citations.length > 0 && (
                        <CitationDisplay citations={msg.citations} />
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </motion.div>
        );
    };

    // Empty state
    if (messages.length === 0 && !isStreaming) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                        <Bot size={32} className="text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">How can I help you?</h2>
                    <p className="text-sm text-gray-400 max-w-md">
                        I can answer questions about your uploaded SOP documents with source citations.
                        Upload a PDF to get started, then ask me anything.
                    </p>

                    {/* Suggested prompts */}
                    <div className="grid grid-cols-2 gap-3 mt-6 max-w-lg">
                        {[
                            { icon: FileText, text: 'Summarize this SOP document', color: 'cyan' },
                            { icon: Search, text: 'What are the key safety procedures?', color: 'blue' },
                            { icon: AlertTriangle, text: 'What compliance requirements apply?', color: 'amber' },
                            { icon: BookOpen, text: 'Find specific step-by-step instructions', color: 'purple' },
                        ].map((prompt, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                onClick={() => setInput(prompt.text)}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 text-gray-300 hover:text-white transition-all text-sm"
                            >
                                <prompt.icon size={16} className={`text-${prompt.color}-400`} />
                                {prompt.text}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Chat toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#060a14]/50">
                <div className="flex items-center gap-2">
                    <button
                        onClick={clearChat}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="New conversation"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={() => setUploadPanelOpen(!uploadPanelOpen)}
                        className={`p-1.5 rounded-lg transition-colors ${uploadPanelOpen
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'hover:bg-white/10 text-gray-400 hover:text-white'
                            }`}
                        title="Upload documents"
                    >
                        <FileText size={16} />
                    </button>
                </div>

                {/* Retrieval metadata indicator */}
                {retrievalMetadata && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Search size={12} className="text-cyan-400" />
                        <span>{retrievalMetadata.totalChunks || 0} chunks retrieved</span>
                        <span>•</span>
                        <span>{retrievalMetadata.avgSimilarity ? `${(retrievalMetadata.avgSimilarity * 100).toFixed(1)}% avg match` : 'Processing'}</span>
                    </div>
                )}
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 px-4 py-4" autoScroll>
                <div ref={messagesEndRef}>
                    {messages.map((msg, index) => renderMessage(msg, index))}

                    {/* Streaming indicator */}
                    {isStreaming && streamingContent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 mt-2 px-4"
                        >
                            <Loader2 size={14} className="text-cyan-400 animate-spin" />
                            <span className="text-xs text-cyan-400">Generating response...</span>
                        </motion.div>
                    )}
                </div>
            </ScrollArea>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-white/5 bg-[#060a14]/50">
                <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your SOP documents..."
                            disabled={isStreaming}
                            rows={1}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/30 text-white placeholder-gray-500 outline-none resize-none disabled:opacity-50 transition-colors text-sm"
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                            onInput={(e) => {
                                e.target.style.height = '44px';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                            }}
                        />
                    </div>

                    {/* Send / Stop button */}
                    {isStreaming ? (
                        <button
                            onClick={handleStop}
                            className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all"
                            title="Stop generating"
                        >
                            <Square size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-3 rounded-xl transition-all ${input.trim()
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                                }`}
                            title="Send message"
                        >
                            <Send size={18} />
                        </button>
                    )}
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-600 mt-2 text-center">
                    Responses are sourced from uploaded documents only. AI may not have information beyond your SOPs.
                </p>
            </div>
        </div>
    );
};

export default ChatPanel;