import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Brain, Sparkles, BookOpen, Layers, ArrowLeft, RefreshCw, FileText,
    AlertCircle, Clock, Tag, Clock3, Type, ListChecks, ListOrdered, Hash,
    ChevronRight, Download, ChevronDown, FileJson2, FileText as FileTxtIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { documentAPI } from '../services/api';
import { exportInsights } from '../utils/exportInsights';
import toast from 'react-hot-toast';

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

const stripMarkdown = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str
        .replace(/^#{1,6}\s+/gm, '')           // remove ####, ###, ##, # headings
        .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1')  // remove **bold** and *italic* markers
        .replace(/^[-*+]\s+/gm, '')              // remove leading bullet markers (-, *, +)
        .trim();
};

const normalizeInsights = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'string') {
        return {
            summary: stripMarkdown(raw), keyTopics: [], keyPoints: [], actionItems: [],
            importantTerms: [], sections: [], statistics: null,
            generatedBy: 'legacy', generatedAt: null, isLegacy: true,
        };
    }
    return {
        summary: stripMarkdown(raw.summary || ''),
        keyTopics: Array.isArray(raw.keyTopics) ? raw.keyTopics.map(stripMarkdown) : [],
        keyPoints: Array.isArray(raw.keyPoints) ? raw.keyPoints.map(stripMarkdown) : [],
        actionItems: Array.isArray(raw.actionItems) ? raw.actionItems.map(stripMarkdown) : [],
        importantTerms: Array.isArray(raw.importantTerms)
            ? raw.importantTerms.map(t => typeof t === 'object' ? { ...t, term: stripMarkdown(t.term) } : stripMarkdown(t))
            : (Array.isArray(raw.importantsTerms) ? raw.importantsTerms.map(t => typeof t === 'object' ? { ...t, term: stripMarkdown(t.term) } : stripMarkdown(t)) : []),
        sections: Array.isArray(raw.sections)
            ? raw.sections.map(s => ({ heading: stripMarkdown(s.heading || ''), preview: stripMarkdown(s.preview || '') }))
            : [],
        statistics: raw.statistics || null,
        generatedBy: raw.generatedBy || 'unknown',
        generatedAt: raw.generatedAt || null,
        isLegacy: false,
    };
};

const StatPill = ({ icon: Icon, label, value, color = 'violet' }) => {
    const colorMap = {
        violet: 'bg-violet-500/[0.06] border-violet-500/[0.12] text-violet-300',
        blue: 'bg-blue-500/[0.06] border-blue-500/[0.12] text-blue-300',
        amber: 'bg-amber-500/[0.06] border-amber-500/[0.12] text-amber-300',
        emerald: 'bg-emerald-500/[0.06] border-emerald-500/[0.12] text-emerald-300',
        indigo: 'bg-indigo-500/[0.06] border-indigo-500/[0.12] text-indigo-300',
    };
    return (
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] border ${colorMap[color]}`}>
            <Icon className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.06em] opacity-70 leading-none mb-0.5">{label}</p>
                <p className="text-[13px] font-semibold truncate">{value}</p>
            </div>
        </div>
    );
};

const accentMap = {
    violet: 'from-violet-500/[0.10] to-indigo-500/[0.04] border-violet-500/[0.18]',
    blue: 'from-blue-500/[0.10] to-cyan-500/[0.04] border-blue-500/[0.18]',
    amber: 'from-amber-500/[0.10] to-yellow-500/[0.04] border-amber-500/[0.18]',
    emerald: 'from-emerald-500/[0.10] to-teal-500/[0.04] border-emerald-500/[0.18]',
    rose: 'from-rose-500/[0.10] to-pink-500/[0.04] border-rose-500/[0.18]',
};

const Section = ({ title, icon: Icon, accent = 'violet', children, count }) => (
    <motion.div {...fadeInUp} className={`rounded-[12px] bg-gradient-to-br ${accentMap[accent]} overflow-hidden`}>
        <div className="flex items-center justify-between gap-2.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[8px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                    <Icon className="w-[14px] h-[14px] opacity-90" />
                </div>
                <h3 className="text-[14px] font-semibold text-white/90">{title}</h3>
            </div>
            {count != null && <span className="text-[10px] uppercase tracking-[0.06em] text-gray-500">{count}</span>}
        </div>
        <div className="p-4">{children}</div>
    </motion.div>
);

const BulletList = ({ items, emptyText = 'None detected.' }) => {
    if (!items || items.length === 0) return <p className="text-[12px] text-gray-500 italic">{emptyText}</p>;
    return (
        <ul className="space-y-2">
            {items.map((it, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-300/90 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span className="flex-1">{it}</span>
                </li>
            ))}
        </ul>
    );
};

const TermChip = ({ term, count }) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium bg-rose-500/[0.08] border border-rose-500/[0.20] text-rose-200">
        {term}
        <span className="text-[10px] font-mono text-rose-300/70">×{count}</span>
    </span>
);

export default function InsightsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [insightsData, setInsightsData] = useState(null);
    const [polling, setPolling] = useState(false);
    const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
    const downloadRef = useRef(null);

    // Close download menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (downloadRef.current && !downloadRef.current.contains(e.target)) {
                setDownloadMenuOpen(false);
            }
        };
        if (downloadMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [downloadMenuOpen]);

    const handleExport = (format) => {
        setDownloadMenuOpen(false);
        try {
            exportInsights(insights, insightsData, format);
            toast.success(`Insights exported as ${format.toUpperCase()}`);
        } catch (err) {
            toast.error(`Export failed: ${err.message}`);
        }
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const isProcessing = polling || (insightsData?.status && insightsData.status !== 'completed');
    const insights = normalizeInsights(insightsData?.insights);
    const stats = insights?.statistics;
    const generatedBy = insights?.generatedBy;
    const isLegacy = insights?.isLegacy;

    return (
        <div className="max-w-[980px] mx-auto space-y-4">
            <motion.div {...fadeInUp} className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <button onClick={async (e) => { e.persist(); await new Promise(resolve => setTimeout(resolve, 1000)); navigate(-1); }} className="w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200">
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
                <div className="flex items-center gap-2">
                    {insights && !isProcessing && (
                        <div className="relative" ref={downloadRef}>
                            <button
                                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-gradient-to-b from-[#238636] to-[#1a7f37] border border-[#2ea043]/50 text-white hover:from-[#2ea043] hover:to-[#238636] hover:border-[#3fb950]/70 hover:text-white text-[12px] font-semibold shadow-lg shadow-green-900/40 transition-all duration-200"
                            >
                                <Download className="w-[14px] h-[14px]" />
                                Export
                                <ChevronDown className="w-[12px] h-[12px]" />
                            </button>
                            {downloadMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 z-50 w-[180px] rounded-[10px] bg-[#1a1f2e] border border-white/[0.08] shadow-xl shadow-black/40 py-1.5">
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <FileText className="w-[14px] h-[14px] text-red-400" />
                                        PDF Document
                                    </button>
                                    <button
                                        onClick={() => handleExport('txt')}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <FileTxtIcon className="w-[14px] h-[14px] text-blue-400" />
                                        Plain Text
                                    </button>
                                    <button
                                        onClick={() => handleExport('json')}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                                    >
                                        <FileJson2 className="w-[14px] h-[14px] text-amber-400" />
                                        JSON Data
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {generatedBy && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.06em] bg-violet-500/[0.08] border border-violet-500/[0.20] text-violet-300">
                            <Sparkles className="w-3 h-3" />
                            {isLegacy ? 'Legacy insights' : `Generated by ${generatedBy}`}
                        </span>
                    )}
                </div>
            </motion.div>

            {loading && !insightsData && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-10 text-center">
                    <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-4" />
                    <h3 className="text-[16px] font-semibold text-white/90 mb-1.5">Loading Insights</h3>
                    <p className="text-[13px] text-gray-400/70">Fetching AI-generated analysis for this document...</p>
                </motion.div>
            )}

            {isProcessing && insightsData && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[12px] bg-amber-500/[0.04] border border-amber-500/[0.15] p-6">
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
                    <div className="w-full h-[6px] rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${insightsData.processingProgress || 30}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500" />
                    </div>
                    <p className="text-[11px] text-amber-400/50 mt-2 text-right">{insightsData.processingProgress || 0}% complete</p>
                </motion.div>
            )}

            {error && !loading && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[12px] bg-red-500/[0.04] border border-red-500/[0.15] p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-[10px] bg-red-500/[0.10] border border-red-500/[0.15] flex items-center justify-center">
                            <AlertCircle className="w-[20px] h-[20px] text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-semibold text-red-300/90">Failed to Load Insights</h3>
                            <p className="text-[12px] text-red-400/60">{error}</p>
                        </div>
                    </div>
                    <button onClick={async (e) => { e.persist(); await new Promise(resolve => setTimeout(resolve, 1000)); fetchInsights(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-red-500/[0.10] border border-red-500/[0.18] text-red-400 hover:bg-red-500/[0.18] hover:text-red-300 text-[12px] font-medium transition-all duration-200">
                        <RefreshCw className="w-[12px] h-[12px]" /> Retry
                    </button>
                </motion.div>
            )}

            {insights && !isProcessing && !error && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }} className="space-y-4">
                    <motion.div {...fadeInUp} className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-4">
                        <div className="flex items-center gap-2.5 mb-3">
                            <FileText className="w-[18px] h-[18px] text-violet-400" />
                            <h3 className="text-[14px] font-semibold text-white/90">Document Summary</h3>
                            <span className="ml-auto text-[10px] uppercase tracking-[0.06em] text-gray-500 truncate max-w-[50%]">
                                {insightsData?.originalName || insightsData?.name || ''}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                            <StatPill icon={BookOpen} label="Pages" value={insightsData?.totalPages ?? '—'} color="blue" />
                            <StatPill icon={Layers} label="Chunks" value={insightsData?.totalChunks ?? '—'} color="amber" />
                            <StatPill icon={Type} label="Words" value={stats?.wordCount != null ? stats.wordCount.toLocaleString() : '—'} color="emerald" />
                            <StatPill icon={Clock3} label="Read time" value={stats?.readingTimeMinutes != null ? `${stats.readingTimeMinutes} min` : '—'} color="indigo" />
                        </div>
                    </motion.div>

                    <Section title="Summary" icon={Sparkles} accent="violet">
                        {insights.summary ? (
                            <p className="text-[14px] text-gray-200/90 leading-relaxed whitespace-pre-wrap">{insights.summary}</p>
                        ) : (
                            <p className="text-[13px] text-gray-500 italic">No summary available.</p>
                        )}
                    </Section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Section title="Key Topics" icon={Tag} accent="blue" count={insights.keyTopics.length}>
                            {insights.keyTopics.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {insights.keyTopics.map((t, i) => (
                                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-500/[0.08] border border-blue-500/[0.20] text-blue-200">{t}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[12px] text-gray-500 italic">No key topics detected.</p>
                            )}
                        </Section>

                        <Section title="Action Items" icon={ListChecks} accent="amber" count={insights.actionItems.length}>
                            <BulletList items={insights.actionItems} emptyText="No explicit action items detected." />
                        </Section>
                    </div>

                    <Section title="Key Points" icon={ListOrdered} accent="emerald" count={insights.keyPoints.length}>
                        <BulletList items={insights.keyPoints} emptyText="No key points detected." />
                    </Section>

                    <Section title="Important Terms" icon={Hash} accent="rose" count={insights.importantTerms.length}>
                        {insights.importantTerms.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {insights.importantTerms.map((t, i) => (
                                    <TermChip key={i} term={t.term} count={t.count} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-[12px] text-gray-500 italic">No important terms detected.</p>
                        )}
                    </Section>

                    <div className="flex items-center gap-2 pt-1">
                        <button onClick={async (e) => { e.persist(); await new Promise(resolve => setTimeout(resolve, 1000)); navigate("/dashboard/documents"); }} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-violet-500/[0.10] border border-violet-500/[0.18] text-violet-400 hover:bg-violet-500/[0.18] hover:text-violet-300 text-[13px] font-medium transition-all duration-200">
                            View in Documents
                            <ChevronRight className="w-[14px] h-[14px]" />
                        </button>
                        <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-gradient-to-b from-[#238636] to-[#1a7f37] border border-[#2ea043]/50 text-white hover:from-[#2ea043] hover:to-[#238636] hover:border-[#3fb950]/70 hover:text-white text-[13px] font-semibold shadow-lg shadow-green-900/40 transition-all duration-200">
                            <Download className="w-[14px] h-[14px]" />
                            Download PDF
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
