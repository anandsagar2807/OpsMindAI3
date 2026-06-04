import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Brain,
    Sparkles,
    BookOpen,
    Layers,
    Hash,
    ArrowLeft,
    ExternalLink,
    RefreshCw,
    FileText,
    AlertCircle,
    Clock,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { documentAPI } from '../services/api';
import toast from 'react-hot-toast';

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export default function InsightsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [insightsData, setInsightsData] = useState(null);
    const [polling, setPolling] = useState(false);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await getToken();
            const response = await documentAPI.getInsights(id, token);
            const data = response.data;

            if (data.insights) {
                setInsightsData(data);
                setPolling(false);
            } else if (data.message && data.status !== 'completed') {
                // Document still processing — poll
                setInsightsData(data);
                setPolling(true);
                setTimeout(() => fetchInsights(), 3000);
            } else {
                setInsightsData(data);
                setPolling(false);
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to fetch insights';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchInsights();
    }, [id]);

    const isProcessing = polling || (insightsData?.status && insightsData.status !== 'completed');

    return (
        <div className="max-w-[900px] mx-auto space-y-4">
            {/* ─── Header with back navigation ─── */}
            <motion.div {...fadeInUp} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                    >
                        <ArrowLeft className="w-[16px] h-[16px]" />
                    </button>
                    <div>
                        <h1 className="text-[22px] font-bold text-white tracking-[-0.02em] flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
                                <Brain className="w-[16px] h-[16px] text-violet-400" />
                            </div>
                            AI Document Insights
                        </h1>
                        <p className="text-[13px] text-gray-400/70 mt-1 ml-[42px]">
                            {insightsData?.originalName || insightsData?.name || 'Analyzing document...'}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ─── Loading State ─── */}
            {loading && !insightsData && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-10 text-center"
                >
                    <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" />
                    <h3 className="text-[16px] font-semibold text-white/90 mb-1.5">Loading Insights</h3>
                    <p className="text-[13px] text-gray-400/70">Fetching AI-generated analysis for this document...</p>
                </motion.div>
            )}

            {/* ─── Processing State ─── */}
            {isProcessing && insightsData && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[12px] bg-amber-500/[0.04] border border-amber-500/[0.15] p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-[10px] bg-amber-500/[0.10] border border-amber-500/[0.15] flex items-center justify-center">
                            <Clock className="w-[20px] h-[20px] text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-semibold text-amber-300/90">Document Still Processing</h3>
                            <p className="text-[12px] text-amber-400/60">
                                {insightsData.message || 'Insights will be available once processing completes.'}
                            </p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-[6px] rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insightsData.processingProgress || 30}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
                        />
                    </div>
                    <p className="text-[11px] text-amber-400/50 mt-2 text-right">
                        {insightsData.processingProgress || 0}% complete
                    </p>
                </motion.div>
            )}

            {/* ─── Error State ─── */}
            {error && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[12px] bg-red-500/[0.04] border border-red-500/[0.15] p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-[10px] bg-red-500/[0.10] border border-red-500/[0.15] flex items-center justify-center">
                            <AlertCircle className="w-[20px] h-[20px] text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-semibold text-red-300/90">Failed to Load Insights</h3>
                            <p className="text-[12px] text-red-400/60">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchInsights}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-red-500/[0.10] border border-red-500/[0.18] text-red-400 hover:bg-red-500/[0.18] hover:text-red-300 text-[12px] font-medium transition-all duration-200"
                    >
                        <RefreshCw className="w-[12px] h-[12px]" />
                        Retry
                    </button>
                </motion.div>
            )}

            {/* ─── Insights Content ─── */}
            {insightsData && !isProcessing && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="space-y-4"
                >
                    {/* Document Stats Card */}
                    <div className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-4">
                        <div className="flex items-center gap-2.5 mb-3">
                            <FileText className="w-[18px] h-[18px] text-violet-400" />
                            <h3 className="text-[14px] font-semibold text-white/90">Document Summary</h3>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <StatBadge
                                icon={FileText}
                                label="Document"
                                value={insightsData.originalName || insightsData.name || '—'}
                                color="violet"
                            />
                            <StatBadge
                                icon={BookOpen}
                                label="Pages"
                                value={insightsData.totalPages != null ? String(insightsData.totalPages) : '—'}
                                color="blue"
                            />
                            <StatBadge
                                icon={Layers}
                                label="Chunks"
                                value={insightsData.totalChunks != null ? String(insightsData.totalChunks) : '—'}
                                color="amber"
                            />
                            <StatBadge
                                icon={Hash}
                                label="Document ID"
                                value={insightsData.documentId ? insightsData.documentId.substring(0, 8) + '...' : '—'}
                                color="emerald"
                            />
                        </div>
                    </div>

                    {/* Insights Card */}
                    <div className="rounded-[12px] bg-gradient-to-br from-violet-500/[0.04] to-indigo-500/[0.04] border border-violet-500/[0.15] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-violet-500/[0.10] bg-violet-500/[0.04]">
                            <div className="w-8 h-8 rounded-[8px] bg-violet-500/[0.12] border border-violet-500/[0.18] flex items-center justify-center">
                                <Sparkles className="w-[15px] h-[15px] text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-semibold text-white/90">AI-Generated Insights</h3>
                                <p className="text-[11px] text-gray-400/70">Powered by OpenRouter AI</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="rounded-[10px] bg-violet-500/[0.04] border border-violet-500/[0.10] p-4">
                                <div className="flex items-start gap-3">
                                    <Brain className="w-[18px] h-[18px] text-violet-400 shrink-0 mt-0.5" />
                                    <p className="text-[14px] text-gray-300/90 leading-relaxed whitespace-pre-wrap">
                                        {insightsData.insights || 'No insights generated for this document.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/dashboard/documents')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.18] text-violet-400 hover:bg-violet-500/[0.18] hover:text-violet-300 text-[13px] font-medium transition-all duration-200"
                        >
                            <ExternalLink className="w-[14px] h-[14px]" />
                            View in Documents
                            <ChevronRight className="w-[14px] h-[14px]" />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function StatBadge({ icon: Icon, label, value, color }) {
    const colorMap = {
        violet: { bg: 'bg-violet-500/[0.06]', border: 'border-violet-500/[0.12]', text: 'text-violet-400', iconBg: 'bg-violet-500/[0.10]' },
        blue: { bg: 'bg-blue-500/[0.06]', border: 'border-blue-500/[0.12]', text: 'text-blue-400', iconBg: 'bg-blue-500/[0.10]' },
        amber: { bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/[0.12]', text: 'text-amber-400', iconBg: 'bg-amber-500/[0.10]' },
        emerald: { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/[0.12]', text: 'text-emerald-400', iconBg: 'bg-emerald-500/[0.10]' },
    };
    const c = colorMap[color] || colorMap.violet;

    return (
        <div className={`p-3 rounded-[10px] ${c.bg} border ${c.border}`}>
            <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-6 h-6 rounded-[6px] ${c.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-[12px] h-[12px] ${c.text}`} />
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.04em]">{label}</span>
            </div>
            <p className="text-[13px] font-semibold text-white/90 truncate">{value}</p>
        </div>
    );
}