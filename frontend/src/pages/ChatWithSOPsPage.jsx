import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Zap, Shield, FileSearch, FileText, X } from 'lucide-react';
import ChatPanel from '../components/ChatPanel';

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
};

const features = [
    { icon: Zap, title: 'Instant Answers', desc: 'Streaming responses grounded in your SOPs' },
    { icon: Shield, title: 'Cited Sources', desc: 'Every answer links back to source documents' },
    { icon: FileSearch, title: 'Semantic Search', desc: 'Find relevant sections across all documents' },
];

export default function ChatWithSOPsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const docParam = searchParams.get('doc');
    const suggestedDocumentId = docParam || null;

    const clearDocumentScope = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('doc');
        setSearchParams(next, { replace: true });
    };

    return (
        <motion.div
            {...fadeInUp}
            className="h-[calc(100vh-140px)] flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            Chat with SOPs
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-[10px] font-semibold text-violet-300">
                                <Sparkles className="w-2.5 h-2.5" />
                                RAG
                            </span>
                        </h1>
                        <p className="text-xs text-white/40">Ask questions and get grounded answers from your knowledge base</p>
                    </div>
                </div>
            </div>

            {/* Scoped-document banner */}
            <AnimatePresence>
                {suggestedDocumentId && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-violet-500/[0.08] border border-violet-500/[0.18]">
                            <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-violet-200">Scoped to a single document</p>
                                <p className="text-[11px] text-white/40 truncate font-mono">{suggestedDocumentId}</p>
                            </div>
                            <button
                                onClick={clearDocumentScope}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                                title="Search across all documents"
                            >
                                <X className="w-3 h-3" />
                                All documents
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat container */}
            <div className="flex-1 min-h-0 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden shadow-xl shadow-black/20">
                <ChatPanel
                    compact={false}
                    showHistory={true}
                    suggestedDocumentId={suggestedDocumentId}
                />
            </div>

            {/* Feature strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                        <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                            <f.icon className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-white/80 truncate">{f.title}</p>
                            <p className="text-[10px] text-white/40 truncate">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
