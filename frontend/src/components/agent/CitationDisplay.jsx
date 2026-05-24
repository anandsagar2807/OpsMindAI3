import { motion } from 'framer-motion';
import {
    BookOpen, ExternalLink, FileText, Hash, MapPin,
    ChevronRight, ShieldCheck, AlertTriangle
} from 'lucide-react';
import useUIStore from '../../store/uiStore';

const CitationDisplay = ({ citations = [], sources = [], retrievalMetadata = null }) => {
    const { setSourceInspectorOpen, setSelectedSource } = useUIStore();

    if (!citations.length && !sources.length && !retrievalMetadata) return null;

    const handleSourceClick = (source) => {
        setSelectedSource(source);
        setSourceInspectorOpen(true);
    };

    const getSimilarityColor = (score) => {
        if (score >= 0.85) return 'text-emerald-400 bg-emerald-500/20';
        if (score >= 0.7) return 'text-cyan-400 bg-cyan-500/20';
        if (score >= 0.5) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-orange-400 bg-orange-500/20';
    };

    const getSimilarityLabel = (score) => {
        if (score >= 0.85) return 'High';
        if (score >= 0.7) return 'Good';
        if (score >= 0.5) return 'Moderate';
        return 'Low';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 space-y-3"
        >
            {/* Retrieval Metadata Summary */}
            {retrievalMetadata && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                    <ShieldCheck size={14} className="text-cyan-400" />
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{retrievalMetadata.totalChunksRetrieved || 0} chunks retrieved</span>
                        <span>•</span>
                        <span>{retrievalMetadata.contextLength || 0} chars context</span>
                        <span>•</span>
                        <span>Confidence: {retrievalMetadata.averageSimilarity ? `${(retrievalMetadata.averageSimilarity * 100).toFixed(1)}%` : 'N/A'}</span>
                    </div>
                    {retrievalMetadata.hallucinationWarning && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                            <AlertTriangle size={12} />
                            <span>Low confidence</span>
                        </div>
                    )}
                </div>
            )}

            {/* Citations */}
            {citations.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <BookOpen size={12} />
                        <span>Sources & Citations</span>
                    </div>
                    {citations.map((citation, index) => {
                        const score = citation.similarityScore || citation.score || 0;
                        const similarityClass = getSimilarityColor(score);

                        return (
                            <motion.div
                                key={citation._id || index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="group flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.07] transition-all cursor-pointer"
                                onClick={() => handleSourceClick(citation)}
                            >
                                {/* Citation Number */}
                                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold shrink-0">
                                    {index + 1}
                                </div>

                                {/* Citation Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <FileText size={12} className="text-gray-400" />
                                        <span className="text-sm font-medium text-white truncate">
                                            {citation.documentName || citation.source || 'Unknown Document'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        {citation.pageNumber && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <MapPin size={10} />
                                                Page {citation.pageNumber}
                                            </span>
                                        )}
                                        {citation.sectionTitle && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Hash size={10} />
                                                {citation.sectionTitle}
                                            </span>
                                        )}
                                    </div>
                                    {citation.snippet && (
                                        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                                            "{citation.snippet}"
                                        </p>
                                    )}
                                </div>

                                {/* Similarity Score */}
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium shrink-0 ${similarityClass}`}>
                                    <span>{getSimilarityLabel(score)}</span>
                                    <span>{(score * 100).toFixed(0)}%</span>
                                </div>

                                {/* Expand Arrow */}
                                <ChevronRight size={14} className="text-gray-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default CitationDisplay;