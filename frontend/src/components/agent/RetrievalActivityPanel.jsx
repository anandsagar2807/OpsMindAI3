import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Zap, FileText, BarChart3, Clock,
    ChevronDown, ChevronUp, Sparkles, ShieldCheck
} from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useChatStore from '../../store/chatStore';
import ScrollArea from '../ui/ScrollArea';

const RetrievalActivityPanel = () => {
    const { retrievalPanelOpen, setRetrievalPanelOpen } = useUIStore();
    const { retrievalMetadata, citations, sources, messages } = useChatStore();

    // Get the last assistant message's metadata
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    const metadata = retrievalMetadata || lastAssistantMsg?.retrievalMetadata;
    const activeCitations = citations.length > 0 ? citations : (lastAssistantMsg?.citations || []);
    const activeSources = sources.length > 0 ? sources : (lastAssistantMsg?.sources || []);

    return (
        <AnimatePresence>
            {retrievalPanelOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="border-b border-white/5 bg-[#060a14]/80"
                >
                    <div className="px-4 py-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-cyan-400" />
                                <h3 className="text-sm font-semibold text-white">Retrieval Activity</h3>
                            </div>
                            <button
                                onClick={() => setRetrievalPanelOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronUp size={16} />
                            </button>
                        </div>

                        {/* Retrieval Pipeline Visualization */}
                        {metadata ? (
                            <div className="space-y-4">
                                {/* Pipeline Steps */}
                                <div className="flex items-center gap-2">
                                    {[
                                        { icon: Search, label: 'Query', color: 'cyan', done: true },
                                        { icon: Zap, label: 'Embed', color: 'blue', done: true },
                                        { icon: FileText, label: 'Search', color: 'purple', done: true },
                                        { icon: BarChart3, label: 'Rank', color: 'amber', done: true },
                                        { icon: ShieldCheck, label: 'Verify', color: 'emerald', done: true },
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5"
                                        >
                                            <step.icon size={12} className={`text-${step.color}-400`} />
                                            <span className="text-xs text-gray-300">{step.label}</span>
                                            {step.done && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-500">Chunks</p>
                                        <p className="text-sm font-semibold text-white">
                                            {metadata.totalChunksRetrieved || metadata.chunksRetrieved || metadata.totalChunks || '—'}
                                        </p>
                                    </div>
                                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-500">Similarity</p>
                                        <p className="text-sm font-semibold text-cyan-400">
                                            {metadata.averageSimilarity
                                                ? `${(metadata.averageSimilarity * 100).toFixed(1)}%`
                                                : '—'}
                                        </p>
                                    </div>
                                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-500">Docs</p>
                                        <p className="text-sm font-semibold text-white">
                                            {metadata.documentsUsed || metadata.uniqueDocuments || activeSources.length || '—'}
                                        </p>
                                    </div>
                                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-center">
                                        <p className="text-xs text-gray-500">Time</p>
                                        <p className="text-sm font-semibold text-white">
                                            {metadata.processingTimeMs || metadata.searchTimeMs
                                                ? `${metadata.processingTimeMs || metadata.searchTimeMs}ms`
                                                : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Top Retrieved Chunks */}
                                {activeCitations.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Top Retrieved Chunks
                                        </p>
                                        <ScrollArea className="max-h-[200px]">
                                            <div className="space-y-1.5">
                                                {activeCitations.slice(0, 8).map((citation, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5"
                                                    >
                                                        <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-white truncate">
                                                                {citation.documentName || 'Document'}
                                                            </p>
                                                            {citation.snippet && (
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {citation.snippet.slice(0, 60)}...
                                                                </p>
                                                            )}
                                                        </div>
                                                        {citation.similarityScore && (
                                                            <div className="text-xs font-medium shrink-0">
                                                                <span className={
                                                                    citation.similarityScore >= 0.8 ? 'text-emerald-400' :
                                                                        citation.similarityScore >= 0.5 ? 'text-cyan-400' :
                                                                            citation.similarityScore >= 0.3 ? 'text-yellow-400' : 'text-red-400'
                                                                }>
                                                                    {(citation.similarityScore * 100).toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Search size={24} className="text-gray-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No retrieval activity yet</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Ask a question to see the RAG pipeline in action
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RetrievalActivityPanel;