import { motion } from 'framer-motion';
import {
    FileText, BookOpen, MapPin, Hash, ExternalLink,
    ChevronRight, Shield, BarChart3, Quote
} from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useChatStore from '../../store/chatStore';
import Sheet from '../ui/Sheet';
import ScrollArea from '../ui/ScrollArea';

const SourceInspector = () => {
    const { sourceInspectorOpen, setSourceInspectorOpen, selectedSource } = useUIStore();
    const { citations, sources, retrievalMetadata } = useChatStore();

    const formatSimilarity = (score) => {
        if (!score) return 'N/A';
        const percentage = (score * 100).toFixed(1);
        let color = 'text-emerald-400';
        if (score < 0.5) color = 'text-yellow-400';
        if (score < 0.3) color = 'text-red-400';
        return { percentage, color };
    };

    const getConfidenceLabel = (score) => {
        if (!score) return 'Unknown';
        if (score >= 0.8) return 'High Confidence';
        if (score >= 0.5) return 'Medium Confidence';
        if (score >= 0.3) return 'Low Confidence';
        return 'Very Low Confidence';
    };

    const getConfidenceColor = (score) => {
        if (!score) return 'gray';
        if (score >= 0.8) return 'emerald';
        if (score >= 0.5) return 'cyan';
        if (score >= 0.3) return 'yellow';
        return 'red';
    };

    // Use selected source or fall back to citations
    const displaySource = selectedSource || (citations && citations[0]);

    return (
        <Sheet
            open={sourceInspectorOpen}
            onClose={() => setSourceInspectorOpen(false)}
            side="right"
            title="Source Inspector"
            width={420}
        >
            <div className="px-4 py-4 space-y-6">
                {/* Retrieval Metadata */}
                {retrievalMetadata && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={16} className="text-cyan-400" />
                            <h3 className="text-sm font-semibold text-white">Retrieval Statistics</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-gray-500">Chunks Retrieved</p>
                                <p className="text-lg font-semibold text-white">
                                    {retrievalMetadata.totalChunksRetrieved || retrievalMetadata.chunksRetrieved || '—'}
                                </p>
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-gray-500">Avg Similarity</p>
                                <p className="text-lg font-semibold text-white">
                                    {retrievalMetadata.averageSimilarity
                                        ? `${(retrievalMetadata.averageSimilarity * 100).toFixed(1)}%`
                                        : '—'}
                                </p>
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-gray-500">Documents Used</p>
                                <p className="text-lg font-semibold text-white">
                                    {retrievalMetadata.documentsUsed || retrievalMetadata.uniqueDocuments || '—'}
                                </p>
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-gray-500">Processing Time</p>
                                <p className="text-lg font-semibold text-white">
                                    {retrievalMetadata.processingTimeMs
                                        ? `${retrievalMetadata.processingTimeMs}ms`
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selected Source Detail */}
                {displaySource && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-cyan-400" />
                            <h3 className="text-sm font-semibold text-white">Source Detail</h3>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4"
                        >
                            {/* Document Name */}
                            <div className="flex items-center gap-2">
                                <FileText size={14} className="text-gray-400" />
                                <span className="text-sm font-medium text-white">
                                    {displaySource.documentName || displaySource.fileName || 'Unknown Document'}
                                </span>
                            </div>

                            {/* Page Number */}
                            {displaySource.pageNumber && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span className="text-sm text-gray-300">
                                        Page {displaySource.pageNumber}
                                    </span>
                                </div>
                            )}

                            {/* Section Title */}
                            {displaySource.sectionTitle && (
                                <div className="flex items-center gap-2">
                                    <BookOpen size={14} className="text-gray-400" />
                                    <span className="text-sm text-gray-300">
                                        {displaySource.sectionTitle}
                                    </span>
                                </div>
                            )}

                            {/* Chunk Index */}
                            {displaySource.chunkIndex && (
                                <div className="flex items-center gap-2">
                                    <Hash size={14} className="text-gray-400" />
                                    <span className="text-sm text-gray-300">
                                    Chunk #{displaySource.chunkIndex}
                                    </span>
                                </div>
                            )}

                            {/* Similarity Score */}
                            {displaySource.similarityScore && (
                                <div className="flex items-center gap-3">
                                    <Shield size={14} className="text-gray-400" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-300">Similarity</span>
                                            <span className={`text-sm font-semibold ${formatSimilarity(displaySource.similarityScore).color}`}>
                                                {formatSimilarity(displaySource.similarityScore).percentage}%
                                            </span>
                                        </div>
                                        <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${displaySource.similarityScore * 100}%` }}
                                                transition={{ duration: 0.5 }}
                                                className={`h-full rounded-full bg-${getConfidenceColor(displaySource.similarityScore)}-500`}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {getConfidenceLabel(displaySource.similarityScore)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Snippet */}
                            {displaySource.snippet && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Quote size={14} className="text-gray-400" />
                                        <span className="text-xs text-gray-500">Relevant Snippet</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                                        <p className="text-sm text-gray-300 leading-relaxed italic">
                                            "{displaySource.snippet}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* All Citations */}
                {citations && citations.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-cyan-400" />
                            <h3 className="text-sm font-semibold text-white">All Citations ({citations.length})</h3>
                        </div>
                        <div className="space-y-2">
                            {citations.map((citation, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/20 cursor-pointer transition-all"
                                    onClick={() => {
                                        useUIStore.getState().setSelectedSource(citation);
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm text-white truncate">
                                                {citation.documentName || 'Document'}
                                            </span>
                                        </div>
                                        {citation.similarityScore && (
                                            <span className={`text-xs font-medium ${formatSimilarity(citation.similarityScore).color}`}>
                                                {formatSimilarity(citation.similarityScore).percentage}%
                                            </span>
                                        )}
                                    </div>
                                    {citation.pageNumber && (
                                        <p className="text-xs text-gray-500 mt-1 pl-7">
                                            Page {citation.pageNumber}
                                            {citation.sectionTitle ? ` • ${citation.sectionTitle}` : ''}
                                        </p>
                                    )}
                                    {citation.snippet && (
                                        <p className="text-xs text-gray-400 mt-1 pl-7 truncate italic">
                                            "{citation.snippet}"
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sources List */}
                {sources && sources.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ExternalLink size={16} className="text-cyan-400" />
                            <h3 className="text-sm font-semibold text-white">Referenced Documents ({sources.length})</h3>
                        </div>
                        <div className="space-y-2">
                            {sources.map((source, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                                >
                                    <FileText size={14} className="text-gray-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">
                                            {source.documentName || source.name || 'Document'}
                                        </p>
                                        {source.chunkCount && (
                                            <p className="text-xs text-gray-500">
                                                {source.chunkCount} chunks referenced
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight size={14} className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No data state */}
                {!displaySource && (!citations || citations.length === 0) && (!sources || sources.length === 0) && (
                    <div className="text-center py-12 px-4">
                        <FileText size={40} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No source data available</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Ask a question to see retrieved sources and citations
                        </p>
                    </div>
                )}
            </div>
        </Sheet>
    );
};

export default SourceInspector;