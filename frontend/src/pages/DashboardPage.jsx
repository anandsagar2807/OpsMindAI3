import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    FileText,
    Upload,
    TrendingUp,
    Clock,
    Sparkles,
    ArrowUpRight,
    BarChart3,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Brain,
    Layers,
    Hash,
    File,
    Activity,
    Cpu,
    Database,
    Globe,
    Plus,
    Command
} from 'lucide-react';
import { useDashboardStats, useRecentActivity } from '../hooks/useDashboard';
import { useConversations } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.06 } }
};

const COLORS = {
    violet: {
        gradient: 'from-violet-500 to-indigo-600',
        bg: 'bg-violet-500/[0.08]',
        bgStrong: 'bg-violet-500/[0.12]',
        border: 'border-violet-500/[0.15]',
        borderStrong: 'border-violet-500/[0.25]',
        text: 'text-violet-400',
        textMuted: 'text-violet-400/60',
        shadow: 'shadow-violet-500/10',
        shadowStrong: 'shadow-violet-500/20',
        ring: 'ring-violet-500/20',
    },
    emerald: {
        gradient: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-500/[0.08]',
        bgStrong: 'bg-emerald-500/[0.12]',
        border: 'border-emerald-500/[0.15]',
        borderStrong: 'border-emerald-500/[0.25]',
        text: 'text-emerald-400',
        textMuted: 'text-emerald-400/60',
        shadow: 'shadow-emerald-500/10',
        shadowStrong: 'shadow-emerald-500/20',
        ring: 'ring-emerald-500/20',
    },
    amber: {
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-500/[0.08]',
        bgStrong: 'bg-amber-500/[0.12]',
        border: 'border-amber-500/[0.15]',
        borderStrong: 'border-amber-500/[0.25]',
        text: 'text-amber-400',
        textMuted: 'text-amber-400/60',
        shadow: 'shadow-amber-500/10',
        shadowStrong: 'shadow-amber-500/20',
        ring: 'ring-amber-500/20',
    },
    blue: {
        gradient: 'from-blue-500 to-cyan-600',
        bg: 'bg-blue-500/[0.08]',
        bgStrong: 'bg-blue-500/[0.12]',
        border: 'border-blue-500/[0.15]',
        borderStrong: 'border-blue-500/[0.25]',
        text: 'text-blue-400',
        textMuted: 'text-blue-400/60',
        shadow: 'shadow-blue-500/10',
        shadowStrong: 'shadow-blue-500/20',
        ring: 'ring-blue-500/20',
    },
    rose: {
        gradient: 'from-rose-500 to-pink-600',
        bg: 'bg-rose-500/[0.08]',
        bgStrong: 'bg-rose-500/[0.12]',
        border: 'border-rose-500/[0.15]',
        borderStrong: 'border-rose-500/[0.25]',
        text: 'text-rose-400',
        textMuted: 'text-rose-400/60',
        shadow: 'shadow-rose-500/10',
        shadowStrong: 'shadow-rose-500/20',
        ring: 'ring-rose-500/20',
    },
};

function StatCard({ icon: Icon, label, value, subValue, color, trend, delay = 0 }) {
    const c = COLORS[color] || COLORS.violet;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
            className={`relative overflow-hidden rounded-xl ${c.bg} border ${c.border} p-4
                hover:${c.bgStrong} hover:${c.borderStrong} transition-all duration-300 group`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-400/80 text-[11px] font-medium">
                        <TrendingUp className="w-3 h-3" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-[24px] font-bold text-white tracking-[-0.02em] leading-tight">{value}</p>
                <p className="text-[13px] text-gray-400/80 mt-1 leading-tight">{label}</p>
                {subValue && <p className="text-[11px] text-gray-500/70 mt-0.5 leading-tight">{subValue}</p>}
            </div>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/[0.06] to-transparent blur-3xl group-hover:from-violet-500/[0.08] transition-all duration-500" />
        </motion.div>
    );
}

function ActivityItem({ item, index }) {
    const typeConfig = {
        conversation: { icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-500/[0.08]' },
        document: { icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]' },
    };
    const config = typeConfig[item.type] || typeConfig.conversation;
    const timeAgo = getTimeAgo(item.timestamp);

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors duration-200 group"
        >
            <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center ${config.color}`}>
                <config.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/90 truncate leading-tight">{item.title}</p>
                <p className="text-[11px] text-gray-500/80 leading-tight">
                    {item.type === 'conversation' ? `${item.messageCount || 0} messages` : `Status: ${item.status}`}
                </p>
            </div>
            <div className="text-[11px] text-gray-500/70 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                {timeAgo}
            </div>
        </motion.div>
    );
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
}

function QuickAction({ icon: Icon, label, description, color, onClick }) {
    const c = COLORS[color] || COLORS.violet;

    return (
        <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]
                hover:border-white/[0.10] hover:bg-white/[0.05] transition-all duration-200 group w-full text-left`}
        >
            <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-md ${c.shadow} shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white/90 leading-tight">{label}</p>
                <p className="text-[12px] text-gray-500/80 leading-tight">{description}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors duration-200 shrink-0" />
        </motion.button>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: activity, isLoading: activityLoading } = useRecentActivity(8);
    const { data: conversationsData } = useConversations({ limit: 5 });
    const { data: documentsData } = useDocuments({ limit: 5 });

    const conversations = stats?.conversations || { total: 0, active: 0, recent: 0 };
    const documents = stats?.documents || { total: 0, completed: 0, processing: 0, recent: 0, totalChunks: 0, totalEmbeddings: 0, totalPages: 0, totalSize: 0 };
    const messages = stats?.messages || { total: 0, recent: 0 };

    const timeline = activity?.timeline || [];
    const recentConversations = conversationsData?.conversations || activity?.conversations || [];
    const recentDocuments = documentsData?.documents || activity?.documents || [];

    return (
        <div className="max-w-[1280px] mx-auto space-y-6">
            {/* Header */}
            <motion.div {...fadeInUp} className="flex items-start justify-between">
                <div>
                    <h1 className="text-[24px] font-bold text-white tracking-[-0.02em] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/[0.10] border border-violet-500/[0.15] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                        </div>
                        Dashboard
                    </h1>
                    <p className="text-[14px] text-gray-400/70 mt-1.5 ml-[46px]">Welcome back! Here's your OpsMind overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                        <Command className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[11px] text-gray-500">K</span>
                        <span className="text-[11px] text-gray-400">Quick search</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/agent')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium text-[13px] shadow-lg shadow-violet-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={MessageSquare}
                    label="Conversations"
                    value={conversations.total}
                    subValue={`${conversations.active} active`}
                    color="violet"
                    trend={conversations.recent > 0 ? `+${conversations.recent}` : null}
                    delay={0}
                />
                <StatCard
                    icon={FileText}
                    label="Documents"
                    value={documents.total}
                    subValue={`${documents.completed} processed`}
                    color="emerald"
                    trend={documents.recent > 0 ? `+${documents.recent}` : null}
                    delay={0.06}
                />
                <StatCard
                    icon={Hash}
                    label="Knowledge Chunks"
                    value={documents.totalChunks}
                    subValue={`${documents.totalEmbeddings} embeddings`}
                    color="amber"
                    delay={0.12}
                />
                <StatCard
                    icon={Brain}
                    label="AI Responses"
                    value={messages.total}
                    subValue={`${messages.recent} this month`}
                    color="blue"
                    trend={messages.recent > 0 ? `+${messages.recent}` : null}
                    delay={0.18}
                />
            </motion.div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="lg:col-span-1 space-y-4"
                >
                    <h2 className="text-[15px] font-semibold text-white/90 flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-violet-400" />
                        Quick Actions
                    </h2>
                    <div className="space-y-2.5">
                        <QuickAction
                            icon={MessageSquare}
                            label="AI Chat"
                            description="Start a conversation"
                            color="violet"
                            onClick={() => navigate('/agent')}
                        />
                        <QuickAction
                            icon={Upload}
                            label="Upload Document"
                            description="Add to knowledge base"
                            color="emerald"
                            onClick={() => navigate('/dashboard/upload')}
                        />
                        <QuickAction
                            icon={FileText}
                            label="Browse Documents"
                            description="Manage your library"
                            color="amber"
                            onClick={() => navigate('/dashboard/documents')}
                        />
                    </div>

                    {/* Document Status Summary */}
                    <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <h3 className="text-[13px] font-semibold text-white/80 mb-3 flex items-center gap-1.5 uppercase tracking-[0.04em]">
                            <BarChart3 className="w-3.5 h-3.5 text-violet-400/70" />
                            Document Status
                        </h3>
                        <div className="space-y-2">
                            <StatusRow icon={CheckCircle2} label="Completed" count={documents.completed} color="emerald" />
                            <StatusRow icon={Loader2} label="Processing" count={documents.processing} color="amber" />
                            <StatusRow icon={AlertCircle} label="Failed" count={documents.failed || 0} color="rose" />
                        </div>
                        {documents.totalSize > 0 && (
                            <p className="text-[11px] text-gray-500/70 mt-3 pt-2.5 border-t border-white/[0.04]">
                                Total: {formatFileSize(documents.totalSize)} • {documents.totalPages} pages
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.30, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="lg:col-span-2 space-y-4"
                >
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
                            <h2 className="text-[15px] font-semibold text-white/90 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-violet-400" />
                                Recent Activity
                            </h2>
                            <span className="text-[11px] text-gray-500/70">{timeline.length} items</span>
                        </div>

                        {activityLoading ? (
                            <div className="p-10 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                            </div>
                        ) : timeline.length > 0 ? (
                            <div className="max-h-[340px] overflow-y-auto px-1.5 py-1.5">
                                {timeline.map((item, i) => (
                                    <ActivityItem key={item.id || i} item={item} index={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <Layers className="w-10 h-10 text-gray-600/50 mx-auto mb-2" />
                                <p className="text-gray-400/80 text-[13px]">No recent activity</p>
                                <p className="text-gray-500/60 text-[11px] mt-1">Start a conversation or upload documents</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Conversations Preview */}
                    {recentConversations.length > 0 && (
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
                                <h3 className="text-[13px] font-semibold text-white/80 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 text-violet-400/70" />
                                    Recent Conversations
                                </h3>
                                <button
                                    onClick={() => navigate('/agent')}
                                    className="text-[11px] text-violet-400/70 hover:text-violet-400 flex items-center gap-1 transition-colors duration-200"
                                >
                                    View all <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {recentConversations.slice(0, 5).map((conv, i) => (
                                    <motion.button
                                        key={conv._id || i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => navigate('/agent')}
                                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.03] transition-colors duration-200 w-full text-left"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5 text-violet-400/50 shrink-0" />
                                        <span className="text-[13px] text-white/80 truncate flex-1">{conv.title}</span>
                                        <span className="text-[11px] text-gray-500/70 shrink-0">{conv.messageCount || 0} msgs</span>
                                        <span className="text-[11px] text-gray-500/60 shrink-0">{getTimeAgo(conv.updatedAt || conv.createdAt)}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function StatusRow({ icon: Icon, label, count, color }) {
    const colorMap = {
        emerald: 'text-emerald-400',
        amber: 'text-amber-400',
        rose: 'text-rose-400',
    };
    return (
        <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${colorMap[color]}`} />
                <span className="text-[13px] text-gray-300/80">{label}</span>
            </div>
            <span className="text-[13px] font-semibold text-white/90 tabular-nums">{count}</span>
        </div>
    );
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}