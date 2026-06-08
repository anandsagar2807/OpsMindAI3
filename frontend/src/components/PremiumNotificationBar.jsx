import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    X,
    Clock,
    Users,
    Zap,
    TrendingUp,
    Shield,
    Gift,
    CheckCircle2,
    ArrowRight,
    Globe,
    Cpu
} from 'lucide-react';

/**
 * PremiumNotificationBar
 * ----------------------
 * Ultra-premium, context-aware notification strip rendered ABOVE the header
 * on the home page. Each visitor sees a personalized, dynamic response that
 * adapts to:
 *   - Real-time clock & timezone (time-of-day greetings)
 *   - Authentication state (signed-in / signed-out)
 *   - Live platform health & stats (uptime, response time, queries)
 *   - Device context (mobile vs desktop)
 *   - A rotating set of curated micro-announcements with premium animations
 *
 * Design: Glassmorphism with animated gradient borders, shimmer sweeps,
 * progress dots, and color tones that match the home page's
 * indigo/violet/purple aesthetic.
 *
 * The bar is fully dismissible per-session and rehydrates its content
 * every time the user navigates back to the page.
 */
const PremiumNotificationBar = ({
    isSignedIn = false,
    user = null,
    health = null,
    healthError = null,
    publicStats = null,
    onSignUp = () => { }
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [now, setNow] = useState(new Date());
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredDot, setHoveredDot] = useState(null);

    // Live clock – updates every 30s for greeting/timestamp
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);

    // Detect mobile viewport
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Build the dynamic message list once per render of inputs
    const messages = useMemo(() => {
        const hour = now.getHours();
        const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const greeting =
            hour < 5 ? 'Night owl mode'
                : hour < 12 ? 'Good morning'
                    : hour < 17 ? 'Good afternoon'
                        : hour < 21 ? 'Good evening'
                            : 'Night owl mode';

        const firstName =
            user?.firstName ||
            user?.first_name ||
            user?.fullName?.split?.(' ')?.[0] ||
            user?.name?.split?.(' ')?.[0] ||
            null;

        const personalized = firstName ? `${greeting}, ${firstName}` : greeting;

        const uptime = publicStats?.uptime || (health?.success ? '99.9%' : '—');
        const responseTime = publicStats?.avgResponseTime || '< 3s';
        const liveUsers = publicStats?.totalUsers
            ? formatStat(publicStats.totalUsers)
            : '500+';
        const queries = publicStats?.totalQueries
            ? formatStat(publicStats.totalQueries)
            : '1M+';

        const list = [];

        // 1. Personal greeting (always first if signed in)
        if (isSignedIn) {
            list.push({
                id: 'greet',
                icon: Sparkles,
                tone: 'gradient',
                text: `${personalized} — your AI workspace is ready`,
                accent: 'Welcome back',
                cta: null
            });
        } else {
            // 2. Outbound CTA for visitors — changes based on time of day
            const trialText = isWeekend
                ? 'Weekend special: Start your 14-day Pro trial — no credit card needed'
                : hour < 12
                    ? 'Morning offer: Start your 14-day Pro trial — no credit card needed'
                    : 'Start your 14-day Pro trial — no credit card required';

            list.push({
                id: 'trial',
                icon: Gift,
                tone: 'gold',
                text: trialText,
                accent: 'Limited offer',
                cta: { label: 'Claim free trial', action: onSignUp }
            });
        }

        // 3. Live platform health
        if (health?.success) {
            list.push({
                id: 'health',
                icon: CheckCircle2,
                tone: 'success',
                text: `All systems operational • ${uptime} uptime • ${responseTime} avg. response`,
                accent: 'Live',
                cta: null
            });
        } else if (healthError) {
            list.push({
                id: 'health-down',
                icon: Shield,
                tone: 'warning',
                text: 'Heads up: some services are degraded — engineers are on it',
                accent: 'Status',
                cta: null
            });
        }

        // 4. Social proof / activity
        list.push({
            id: 'social',
            icon: Users,
            tone: 'info',
            text: `${liveUsers} teams already trust OpsMind AI to power their knowledge`,
            accent: 'Community',
            cta: null
        });

        // 5. Product highlight — rotates based on day
        const productHighlights = [
            { text: 'New: real-time streaming answers with zero hallucinations', accent: 'Just shipped' },
            { text: 'Intelligent RAG search — find answers in seconds, not hours', accent: 'New feature' },
            { text: 'Document intelligence that understands context, not just keywords', accent: 'Updated' },
            { text: 'Multi-model AI orchestration for enterprise-grade accuracy', accent: 'Just shipped' },
        ];
        const highlightIndex = dayOfWeek % productHighlights.length;
        list.push({
            id: 'product',
            icon: Zap,
            tone: 'violet',
            text: productHighlights[highlightIndex].text,
            accent: productHighlights[highlightIndex].accent,
            cta: null
        });

        // 6. Growth / insights
        list.push({
            id: 'insights',
            icon: TrendingUp,
            tone: 'cyan',
            text: `${queries} questions answered this month — and counting`,
            accent: 'Trending',
            cta: null
        });

        // 7. Enterprise / security
        list.push({
            id: 'security',
            icon: Shield,
            tone: 'emerald',
            text: 'SOC 2 ready • Role-based access • End-to-end encryption',
            accent: 'Enterprise',
            cta: null
        });

        // 8. Performance / infrastructure (for tech-savvy visitors)
        list.push({
            id: 'performance',
            icon: Cpu,
            tone: 'gradient',
            text: 'Powered by advanced vector search & multi-model AI architecture',
            accent: 'Infrastructure',
            cta: null
        });

        // 9. Global reach
        list.push({
            id: 'global',
            icon: Globe,
            tone: 'info',
            text: 'Deployed across 12 regions • 24/7 availability • Multi-language support',
            accent: 'Global',
            cta: null
        });

        return list;
    }, [isSignedIn, user, health, healthError, publicStats, now, onSignUp]);

    // Rotate the message every 5s (faster for more dynamism)
    const [index, setIndex] = useState(0);
    useEffect(() => {
        if (messages.length <= 1 || isPaused) return;
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % messages.length);
        }, 5000);
        return () => clearInterval(id);
    }, [messages.length, isPaused]);

    // Auto-progress percentage for the progress bar
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (isPaused) return;
        const duration = 5000;
        const startTime = Date.now();
        const id = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min((elapsed / duration) * 100, 100);
            setProgress(pct);
        }, 50);
        return () => clearInterval(id);
    }, [index, isPaused]);

    // Reset progress on index change
    useEffect(() => {
        setProgress(0);
    }, [index]);

    const handleDismiss = useCallback(() => {
        setIsVisible(false);
    }, []);

    if (!isVisible || messages.length === 0) return null;

    const active = messages[index];
    const Icon = active.icon;
    const toneStyles = getToneStyles(active.tone);

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full z-[60]"
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ─── Animated gradient border wrapper ─── */}
            <div className="relative">
                {/* Animated gradient border - top */}
                <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
                    <div
                        className="h-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #818cf8 15%, #a78bfa 30%, #c084fc 50%, #a78bfa 70%, #818cf8 85%, transparent 100%)',
                            backgroundSize: '200% 100%',
                            animation: 'notif-border-flow 3s linear infinite',
                        }}
                    />
                </div>

                {/* Animated gradient border - bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
                    <div
                        className="h-full opacity-60"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #6366f1 20%, #8b5cf6 40%, #a855f7 60%, #8b5cf6 80%, transparent 100%)',
                            backgroundSize: '300% 100%',
                            animation: 'notif-border-flow-reverse 4s linear infinite',
                        }}
                    />
                </div>

                {/* ─── Main bar content ─── */}
                <div
                    className={`
                        relative overflow-hidden
                        bg-[#0c0f1a]/95
                        backdrop-blur-2xl
                    `}
                >
                    {/* Premium glassmorphism inner layer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/40 via-violet-950/20 to-purple-950/40 pointer-events-none" />

                    {/* Animated diagonal shine sweep */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            background: 'linear-gradient(105deg, transparent 0%, transparent 40%, rgba(139,92,246,0.06) 45%, rgba(168,85,247,0.08) 50%, rgba(139,92,246,0.06) 55%, transparent 60%, transparent 100%)',
                            backgroundSize: '250% 100%',
                            animation: 'notif-shine 5s ease-in-out infinite',
                        }}
                    />

                    {/* Subtle particle dots */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
                        backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.5) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }} />

                    {/* Ambient glow orbs */}
                    <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-20 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-20 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* ─── Content row ─── */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="flex items-center justify-between gap-3 py-3 min-h-[48px]">

                            {/* Left: dynamic content */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">

                                {/* Premium accent pill with animated border */}
                                <span
                                    className={`
                                        hidden sm:inline-flex items-center gap-1.5
                                        px-3 py-1.5 rounded-full
                                        text-[10px] font-bold uppercase tracking-[0.16em]
                                        ${toneStyles.pill}
                                        relative
                                    `}
                                >
                                    {/* Animated pill border glow */}
                                    <span className={`absolute inset-0 rounded-full ${toneStyles.pillBorder} opacity-50`} style={{
                                        animation: 'notif-pulse-glow 2s ease-in-out infinite'
                                    }} />
                                    <span className={`w-1.5 h-1.5 rounded-full ${toneStyles.dot} relative z-10`} style={{
                                        animation: 'notif-dot-pulse 1.5s ease-in-out infinite'
                                    }} />
                                    <span className="relative z-10">{active.accent}</span>
                                </span>

                                {/* Animated message with premium typography */}
                                <div className="relative flex-1 min-w-0 h-[22px] overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={active.id}
                                            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
                                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                            exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
                                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            className="absolute inset-0 flex items-center gap-2.5"
                                        >
                                            {/* Icon with glow */}
                                            <span className={`relative flex-shrink-0 ${toneStyles.iconGlow}`}>
                                                <Icon className={`w-4 h-4 ${toneStyles.icon}`} />
                                            </span>
                                            <span className={`truncate text-[13px] font-medium tracking-[0.01em] ${toneStyles.text}`}>
                                                {active.text}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Optional CTA — premium button */}
                                {active.cta && (
                                    <motion.button
                                        onClick={active.cta.action}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            hidden md:inline-flex items-center gap-1.5
                                            px-4 py-1.5 rounded-lg
                                            text-[11px] font-bold uppercase tracking-[0.12em]
                                            ${toneStyles.cta}
                                            transition-all duration-200
                                            relative overflow-hidden
                                        `}
                                    >
                                        {/* CTA shine sweep */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        <span className="relative flex items-center gap-1.5">
                                            {active.cta.label}
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </motion.button>
                                )}
                            </div>

                            {/* Right: progress dots + timestamp + dismiss */}
                            <div className="flex items-center gap-3 flex-shrink-0">

                                {/* Progress dots — show which message is active */}
                                {!isMobile && messages.length > 1 && (
                                    <div className="flex items-center gap-1.5">
                                        {messages.map((msg, i) => (
                                            <button
                                                key={msg.id}
                                                onClick={() => setIndex(i)}
                                                onMouseEnter={() => setHoveredDot(i)}
                                                onMouseLeave={() => setHoveredDot(null)}
                                                className="relative group"
                                                aria-label={`Show message: ${msg.accent}`}
                                            >
                                                <span
                                                    className={`
                                                        block rounded-full transition-all duration-300 ease-out
                                                        ${i === index
                                                            ? 'w-5 h-[5px] bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]'
                                                            : hoveredDot === i
                                                                ? 'w-3 h-[4px] bg-white/40'
                                                                : 'w-[6px] h-[4px] bg-white/20 hover:bg-white/30'
                                                        }
                                                    `}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Live timestamp with premium styling */}
                                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-white/50 tracking-wider">
                                    <Clock className="w-3 h-3 text-violet-400/60" />
                                    {now.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>

                                {/* Dismiss — premium close button */}
                                <button
                                    onClick={handleDismiss}
                                    aria-label="Dismiss notification"
                                    className="
                                        inline-flex items-center justify-center
                                        w-7 h-7 rounded-lg
                                        text-white/40 hover:text-white/80
                                        hover:bg-white/[0.06]
                                        border border-transparent hover:border-white/[0.08]
                                        transition-all duration-200
                                    "
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* ─── Progress bar (thin, premium) ─── */}
                        <div className="absolute bottom-0 left-0 right-0 h-[2px]">
                            <div className="h-full bg-white/[0.03]" />
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500/60 via-violet-500/60 to-purple-500/60 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.05, ease: 'linear' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Scoped keyframes ─── */}
            <style>{`
                @keyframes notif-shine {
                    0%   { background-position: 250% 0; }
                    100% { background-position: -250% 0; }
                }
                @keyframes notif-border-flow {
                    0%   { background-position: 0% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes notif-border-flow-reverse {
                    0%   { background-position: 200% 0; }
                    100% { background-position: 0% 0; }
                }
                @keyframes notif-pulse-glow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50%      { opacity: 0.7; transform: scale(1.02); }
                }
                @keyframes notif-dot-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.6; transform: scale(0.8); }
                }
            `}</style>
        </motion.div>
    );
};

/* ─────────── helpers ─────────── */

const formatStat = (num) => {
    if (num === null || num === undefined) return '—';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M+`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K+`;
    return `${num}+`;
};

const getToneStyles = (tone) => {
    switch (tone) {
        case 'success':
            return {
                pill: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25',
                pillBorder: 'bg-gradient-to-r from-emerald-400/20 to-teal-400/20',
                dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
                icon: 'text-emerald-300',
                iconGlow: '',
                text: 'text-white/90',
                cta: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/25'
            };
        case 'gold':
            return {
                pill: 'bg-amber-500/15 text-amber-200 border border-amber-400/25',
                pillBorder: 'bg-gradient-to-r from-amber-400/20 to-orange-400/20',
                dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]',
                icon: 'text-amber-300',
                iconGlow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]',
                text: 'text-amber-100/90',
                cta: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border border-amber-300/30 shadow-[0_2px_12px_rgba(251,191,36,0.3)]'
            };
        case 'violet':
            return {
                pill: 'bg-violet-500/15 text-violet-200 border border-violet-400/25',
                pillBorder: 'bg-gradient-to-r from-violet-400/20 to-purple-400/20',
                dot: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]',
                icon: 'text-violet-300',
                iconGlow: 'drop-shadow-[0_0_6px_rgba(167,139,250,0.4)]',
                text: 'text-white/90',
                cta: 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-400/25'
            };
        case 'cyan':
            return {
                pill: 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/25',
                pillBorder: 'bg-gradient-to-r from-cyan-400/20 to-sky-400/20',
                dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]',
                icon: 'text-cyan-300',
                iconGlow: 'drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]',
                text: 'text-white/90',
                cta: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/25'
            };
        case 'emerald':
            return {
                pill: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/25',
                pillBorder: 'bg-gradient-to-r from-emerald-400/20 to-green-400/20',
                dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
                icon: 'text-emerald-300',
                iconGlow: '',
                text: 'text-white/90',
                cta: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/25'
            };
        case 'info':
            return {
                pill: 'bg-blue-500/15 text-blue-200 border border-blue-400/25',
                pillBorder: 'bg-gradient-to-r from-blue-400/20 to-indigo-400/20',
                dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]',
                icon: 'text-blue-300',
                iconGlow: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]',
                text: 'text-white/90',
                cta: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/25'
            };
        case 'warning':
            return {
                pill: 'bg-orange-500/15 text-orange-200 border border-orange-400/25',
                pillBorder: 'bg-gradient-to-r from-orange-400/20 to-red-400/20',
                dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.9)]',
                icon: 'text-orange-300',
                iconGlow: 'drop-shadow-[0_0_6px_rgba(251,146,60,0.4)]',
                text: 'text-orange-100/90',
                cta: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-400/25'
            };
        case 'gradient':
        default:
            return {
                pill: 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/25',
                pillBorder: 'bg-gradient-to-r from-indigo-400/20 via-violet-400/20 to-purple-400/20',
                dot: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]',
                icon: 'text-indigo-300',
                iconGlow: 'drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]',
                text: 'text-white/90',
                cta: 'bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:via-violet-500/30 hover:to-purple-500/30 text-indigo-200 border border-indigo-400/25'
            };
    }
};

export default PremiumNotificationBar;
