import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Send,
    Square,
    RefreshCw,
    Copy,
    Check,
    Trash2,
    Sparkles,
    FileText,
    Loader2,
    ChevronDown,
    BookOpen,
    Lightbulb,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { streamRAGResponse, chatAPI, ragAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Reusable chat panel powered by the backend RAG streaming API.
 *
 * Used by:
 *   - ChatWithSOPsPage (full-page experience)
 *   - DraggableChatAgent (floating widget)
 *
 * Props:
 *   compact      – tighter spacing for the widget variant
 *   showHistory   – show the conversation sidebar (page only)
 *   suggestedDocumentId – if set, fetch suggested questions for this doc
 */
export default function ChatPanel({ compact = false, showHistory = false, suggestedDocumentId = null }) {
    const { getToken } = useAuth();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [citations, setCitations] = useState([]);
    const [retrievalMetadata, setRetrievalMetadata] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [showSources, setShowSources] = useState({});
    const [copiedId, setCopiedId] = useState(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const abortRef = useRef(null);
    const scrollRef = useRef(null);
    const lastUserQueryRef = useRef('');

    // ── Auto-scroll to bottom on new content ────────────────────────
    const scrollToBottom = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent, scrollToBottom]);

    // ── Load conversation history list ──────────────────────────────
    const loadConversations = useCallback(async () => {
        if (!showHistory) return;
        try {
            const token = await getToken();
            const res = await chatAPI.getAll({ limit: 30 }, token);
            setConversations(Array.isArray(res.data?.conversations) ? res.data.conversations : []);
        } catch {
            /* non-fatal */
        }
    }, [getToken, showHistory]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    // ── Suggested questions for a specific document ─────────────────
    useEffect(() => {
        if (!suggestedDocumentId) {
            setSuggestedQuestions([]);
            return;
        }
        let cancelled = false;
        (async () => {
            setLoadingSuggestions(true);
            try {
                const token = await getToken();
                const res = await fetch(
                    `${import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')}/api/sop/${suggestedDocumentId}/suggested-questions`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) {
                    const json = await res.json();
                    if (!cancelled) setSuggestedQuestions(json.data || []);
                }
            } catch {
                /* non-fatal */
            } finally {
                if (!cancelled) setLoadingSuggestions(false);
            }
        })();
        return () => { cancelled = true; };
    }, [suggestedDocumentId, getToken]);

    // ── Send a message via SSE streaming ────────────────────────────
    const sendMessage = useCallback(async (queryText) => {
        const query = (queryText ?? input).trim();
        if (!query || isStreaming) return;

        lastUserQueryRef.current = query;
        setInput('');
        setIsStreaming(true);
        setStreamingContent('');
        setCitations([]);
        setRetrievalMetadata(null);

        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: query,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        const controller = new AbortController();
        abortRef.current = controller;

        let fullAnswer = '';
        let meta = null;

        await streamRAGResponse(
            query,
            conversationId,
            await getToken(),
            // onMetadata
            (data) => {
                meta = data;
                setRetrievalMetadata(data);
                if (data?.citations) setCitations(data.citations);
                if (data?.conversationId && !conversationId) {
                    setConversationId(data.conversationId);
                }
            },
            // onContent
            (chunk) => {
                fullAnswer += chunk;
                setStreamingContent(fullAnswer);
            },
            // onComplete
            () => {
                const assistantMessage = {
                    id: `assistant-${Date.now()}`,
                    role: 'assistant',
                    content: fullAnswer,
                    citations: meta?.citations || [],
                    retrievalMetadata: meta,
                    createdAt: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setStreamingContent('');
                setIsStreaming(false);
            },
            // onError
            (err) => {
                setIsStreaming(false);
                setStreamingContent('');
                toast.error(err || 'Streaming failed');
            },
            // documentId — scope the search to a single document when provided
            suggestedDocumentId
        );

        // Refresh the conversation list so the new exchange appears in history
        loadConversations();
    }, [input, isStreaming, conversationId, getToken, loadConversations, suggestedDocumentId]);

    // ── Stop streaming ─────────────────────────────────────────────
    const handleStop = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
        }
        if (streamingContent) {
            const assistantMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: streamingContent + '\n\n_(stopped)_',
                citations,
                retrievalMetadata,
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }
        setStreamingContent('');
        setIsStreaming(false);
    }, [streamingContent, citations, retrievalMetadata]);

    // ── Regenerate last response ───────────────────────────────────
    const handleRegenerate = useCallback(() => {
        if (isStreaming || !lastUserQueryRef.current) return;
        // Remove the last assistant message
        setMessages((prev) => {
            const copy = [...prev];
            while (copy.length && copy[copy.length - 1].role === 'assistant') copy.pop();
            return copy;
        });
        sendMessage(lastUserQueryRef.current);
    }, [isStreaming, sendMessage]);

    // ── Clear chat ─────────────────────────────────────────────────
    const handleClear = useCallback(() => {
        setMessages([]);
        setStreamingContent('');
        setCitations([]);
        setRetrievalMetadata(null);
        setConversationId(null);
        setInput('');
        lastUserQueryRef.current = '';
    }, []);

    // ── Copy message ───────────────────────────────────────────────
    const handleCopy = useCallback(async (id, content) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            toast.success('Copied to clipboard');
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    }, []);

    // ── Load a past conversation ────────────────────────────────────
    const loadConversation = useCallback(async (id) => {
        try {
            const token = await getToken();
            const res = await chatAPI.getOne(id, token);
            setConversationId(id);
            const msgs = (res.data?.messages || []).map((m, i) => ({
                id: `${m.role}-${i}-${Date.now()}`,
                role: m.role,
                content: m.content,
                citations: m.citations || [],
                retrievalMetadata: m.retrievalMetadata || null,
                createdAt: m.createdAt,
            }));
            setMessages(msgs);
        } catch {
            toast.error('Failed to load conversation');
        }
    }, [getToken]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const hasMessages = messages.length > 0;
    const padding = compact ? 'p-3' : 'p-4';
    const gap = compact ? 'gap-3' : 'gap-4';

    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* ── Conversation sidebar (page only) ─────────────────── */}
            {showHistory && (
                <div className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-white/[0.02]">
                    <div className="p-3 border-b border-white/[0.06]">
                        <button
                            onClick={handleClear}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-indigo-500/20 hover:from-violet-500/30 hover:to-indigo-500/30 border border-violet-500/20 text-violet-300 text-sm font-medium transition-all"
                        >
                            <Sparkles className="w-4 h-4" />
                            New Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {conversations.length === 0 ? (
                            <p className="text-xs text-white/30 text-center mt-8 px-4">
                                No conversations yet. Start chatting to see history here.
                            </p>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv._id}
                                    onClick={() => loadConversation(conv._id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${conversationId === conv._id
                                        ? 'bg-violet-500/15 text-violet-200 border border-violet-500/20'
                                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white/90'
                                        }`}
                                >
                                    <FileText className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                    <span className="truncate">{conv.title || 'Untitled'}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ── Main chat area ───────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Messages */}
                <div ref={scrollRef} className={`flex-1 overflow-y-auto ${padding} ${gap} flex flex-col`}>
                    {!hasMessages && !isStreaming ? (
                        <EmptyState
                            compact={compact}
                            suggestedQuestions={suggestedQuestions}
                            loadingSuggestions={loadingSuggestions}
                            onSuggestionClick={(q) => sendMessage(q)}
                        />
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    compact={compact}
                                    copiedId={copiedId}
                                    onCopy={handleCopy}
                                    showSources={showSources}
                                    setShowSources={setShowSources}
                                />
                            ))}
                            {isStreaming && (
                                <StreamingBubble content={streamingContent} compact={compact} />
                            )}
                        </>
                    )}
                </div>

                {/* Suggested questions chips (when available & not streaming) */}
                {!hasMessages && !isStreaming && suggestedQuestions.length > 0 && !compact && (
                    <div className="px-4 pb-2 flex flex-wrap gap-2">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                className="px-3 py-1.5 rounded-full text-xs bg-white/[0.04] hover:bg-violet-500/15 border border-white/[0.08] hover:border-violet-500/25 text-white/70 hover:text-violet-200 transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input bar */}
                <div className={`${padding} border-t border-white/[0.06] bg-white/[0.02]`}>
                    <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your SOPs..."
                                rows={1}
                                className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 text-white/90 placeholder-white/30 text-sm px-3 py-2.5 outline-none transition-all max-h-32"
                                style={{ minHeight: compact ? '38px' : '44px' }}
                            />
                        </div>

                        {isStreaming ? (
                            <button
                                onClick={handleStop}
                                className="shrink-0 w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 flex items-center justify-center transition-all"
                                title="Stop generating"
                            >
                                <Square className="w-4 h-4" fill="currentColor" />
                            </button>
                        ) : (
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim()}
                                className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-lg shadow-violet-500/20"
                                title="Send"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Action row */}
                    {hasMessages && !isStreaming && (
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={handleRegenerate}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all"
                                title="Regenerate last response"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Regenerate
                            </button>
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-white/50 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                                title="Clear chat"
                            >
                                <Trash2 className="w-3 h-3" />
                                Clear
                            </button>
                            {retrievalMetadata && (
                                <span className="ml-auto text-[10px] text-white/30">
                                    {retrievalMetadata.totalChunks || 0} sources ·{' '}
                                    {retrievalMetadata.retrievalTimeMs
                                        ? `${Math.round(retrievalMetadata.retrievalTimeMs)}ms`
                                        : '—'}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Empty state with welcome ──────────────────────────────────── */
function EmptyState({ compact, suggestedQuestions, loadingSuggestions, onSuggestionClick }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30 mb-4"
            >
                <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className={`font-bold text-white mb-1.5 ${compact ? 'text-base' : 'text-lg'}`}>
                Chat with your SOPs
            </h3>
            <p className="text-sm text-white/40 max-w-sm mb-5">
                Ask questions about your uploaded documents. Answers are grounded in your knowledge base with source citations.
            </p>

            {loadingSuggestions ? (
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading suggestions...
                </div>
            ) : suggestedQuestions.length > 0 ? (
                <div className="w-full max-w-md space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-white/30 font-semibold flex items-center gap-1.5 justify-center">
                        <Lightbulb className="w-3 h-3" />
                        Suggested questions
                    </p>
                    {suggestedQuestions.slice(0, 4).map((q, i) => (
                        <button
                            key={i}
                            onClick={() => onSuggestionClick(q)}
                            className="w-full text-left px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-500/10 border border-white/[0.06] hover:border-violet-500/20 text-sm text-white/70 hover:text-violet-200 transition-all flex items-start gap-2"
                        >
                            <BookOpen className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                            <span>{q}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                    {[
                        'What are the key steps in this SOP?',
                        'Who is responsible for approvals?',
                        'What risks are mentioned?',
                        'Summarize the workflow',
                    ].map((q, i) => (
                        <button
                            key={i}
                            onClick={() => onSuggestionClick(q)}
                            className="text-left px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-violet-500/10 border border-white/[0.06] hover:border-violet-500/20 text-xs text-white/60 hover:text-violet-200 transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Message bubble ────────────────────────────────────────────── */
function MessageBubble({ message, compact, copiedId, onCopy, showSources, setShowSources }) {
    const isUser = message.role === 'user';
    const isCopied = copiedId === message.id;
    const hasCitations = !isUser && message.citations?.length > 0;
    const sourcesOpen = showSources[message.id];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-[85%] ${isUser ? 'order-2' : ''}`}>
                {!isUser && (
                    <div className="flex items-center gap-1.5 mb-1 ml-1">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[11px] text-white/40 font-medium">OpsMind AI</span>
                    </div>
                )}
                <div
                    className={`rounded-2xl ${compact ? 'px-3 py-2 text-[13px]' : 'px-4 py-2.5 text-sm'} leading-relaxed ${isUser
                        ? 'bg-gradient-to-br from-violet-500/90 to-indigo-600/90 text-white rounded-br-md'
                        : message.isError
                            ? 'bg-red-500/[0.08] border border-red-500/20 text-red-200 rounded-bl-md'
                            : 'bg-white/[0.04] border border-white/[0.06] text-white/90 rounded-bl-md'
                        }`}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none break-words [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_pre]:my-2 [&_code]:text-violet-300 [&_code]:bg-white/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_a]:text-violet-400 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_blockquote]:border-violet-500/30">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Citations / sources */}
                {hasCitations && (
                    <div className="mt-1.5 ml-1">
                        <button
                            onClick={() => setShowSources((p) => ({ ...p, [message.id]: !p[message.id] }))}
                            className="flex items-center gap-1 text-[11px] text-violet-400/70 hover:text-violet-300 transition-colors"
                        >
                            <FileText className="w-3 h-3" />
                            {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
                            <ChevronDown className={`w-3 h-3 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {sourcesOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-1.5 space-y-1.5 overflow-hidden"
                                >
                                    {message.citations.map((cite, i) => (
                                        <CitationCard key={i} cite={cite} index={i} />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Action buttons for assistant messages */}
                {!isUser && !message.isError && (
                    <div className="flex items-center gap-1 mt-1 ml-1">
                        <button
                            onClick={() => onCopy(message.id, message.content)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all"
                            title="Copy"
                        >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {isCopied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/* ─── Citation card ─────────────────────────────────────────────── */
function CitationCard({ cite, index }) {
    const confidence = cite.similarity || cite.confidence || 0;
    const pct = Math.round(confidence * 100);
    const confColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-rose-400';

    return (
        <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2.5 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="shrink-0 w-4 h-4 rounded bg-violet-500/20 text-violet-300 text-[9px] font-bold flex items-center justify-center">
                        {index + 1}
                    </span>
                    <span className="truncate text-white/70 font-medium">
                        {cite.source?.documentName || cite.documentName || cite.title || 'Source'}
                    </span>
                </div>
                <span className={`shrink-0 text-[10px] font-semibold ${confColor}`}>{pct}%</span>
            </div>
            {cite.snippet && (
                <p className="text-white/40 line-clamp-2 leading-relaxed">{cite.snippet}</p>
            )}
            {cite.source?.pageNumber && (
                <p className="text-[10px] text-white/25 mt-1">Page {cite.source.pageNumber}</p>
            )}
        </div>
    );
}

/* ─── Streaming bubble ─────────────────────────────────────────── */
function StreamingBubble({ content, compact }) {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="max-w-[85%]">
                <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[11px] text-white/40 font-medium">OpsMind AI</span>
                    <Loader2 className="w-3 h-3 text-violet-400 animate-spin ml-1" />
                </div>
                <div className={`rounded-2xl ${compact ? 'px-3 py-2 text-[13px]' : 'px-4 py-2.5 text-sm'} leading-relaxed bg-white/[0.04] border border-white/[0.06] text-white/90 rounded-bl-md`}>
                    {content ? (
                        <div className="prose prose-invert prose-sm max-w-none break-words [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_code]:text-violet-300 [&_code]:bg-white/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            <span className="inline-block w-1.5 h-3.5 bg-violet-400 animate-pulse ml-0.5 align-middle" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-white/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
