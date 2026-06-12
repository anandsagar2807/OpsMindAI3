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
    Cpu,
    Star
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
 * Design: Deep glassmorphism with multi-layered animated gradient borders,
 * shimmer sweeps, pulsing glow orbs, progress bar with glow trail,
 * and color tones that match the home page's indigo/violet/purple aesthetic.
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

    // Live clock – updates every 30s
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

    // Build the dynamic message list
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
            // 2. Outbound CTA for visitors
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

        // 4. Social proof
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

        // 8. Performance / infrastructure
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

    // Rotate message every 5s
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
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full z-[60]"
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ─── Outer glow ring ─── */}
            <div className="absolute -inset-[1px] rounded-b-xl bg-gradient-to-r from-indigo-500/30 via-violet-500/40 to-purple-500/30 blur-sm opacity-70 pointer-events-none" />

            <div className="relative">
                {/* ─── Triple-layered animated gradient borders ─── */}
                {/* Top border — fastest flow */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden rounded-t-xl">
                    <div
                        className="h-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #6366f1 10%, #8b5cf6 25%, #a78bfa 40%, #c084fc 55%, #a78bfa 70%, #8b5cf6 85%, #6366f1 95%, transparent 100%)',
                            backgroundSize: '300% 100%',
                            animation: 'notif-border-flow 3s linear infinite',
                        }}
                    />
                </div>

                {/* Bottom border — slower, reverse flow */}
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden rounded-b-xl">
                    <div
                        className="h-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #a855f7 15%, #c084fc 35%, #e879f9 55%, #c084fc 75%, #a855f7 90%, transparent 100%)',
                            backgroundSize: '250% 100%',
                            animation: 'notif-border-flow-reverse 4s linear infinite',
                        }}
                    />
                </div>

                {/* ─── Main bar body ─── */}
                <div className="relative overflow-hidden bg-[#06080d]/95 backdrop-blur-3xl">
                    {/* Multi-layered background */}
                    {/* Layer 1: Deep base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d1a] via-[#0d1025] to-[#0a0d1a]" />

                    {/* Layer 2: Colored overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/50 via-violet-950/30 to-purple-950/50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.02]" />

                    {/* Layer 3: Diagonal shimmer sweep */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(110deg, transparent 0%, transparent 30%, rgba(139,92,246,0.04) 40%, rgba(168,85,247,0.08) 45%, rgba(139,92,246,0.06) 48%, rgba(99,102,241,0.04) 52%, rgba(139,92,246,0.04) 55%, transparent 65%, transparent 100%)',
                            backgroundSize: '250% 100%',
                            animation: 'notif-shine 5s ease-in-out infinite',
                        }}
                    />

                    {/* Layer 4: Dot grid pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
                        backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.6) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px'
                    }} />

                    {/* Layer 5: Horizontal line texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)`,
                        backgroundSize: '100% 4px'
                    }} />

                    {/* Ambient glow orbs — larger, more dramatic */}
                    <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-32 bg-indigo-600/8 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-48 h-24 bg-violet-500/6 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-32 bg-purple-600/8 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDuration: '5s' }} />
                    <div className="absolute right-1/4 top-0 w-32 h-16 bg-fuchsia-500/5 rounded-full blur-[50px] pointer-events-none" />

                    {/* ─── Content row ─── */}
                    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative">
                        <div className="flex items-center justify-between gap-4 py-3.5 min-h-[52px]">

                            {/* ─── Left: dynamic content ─── */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">

                                {/* Premium accent pill with enhanced glow */}
                                <span
                                    className={`
                                        hidden sm:inline-flex items-center gap-2
                                        px-3.5 py-2 rounded-xl
                                        text-[10px] font-extrabold uppercase tracking-[0.18em]
                                        ${toneStyles.pill}
                                        relative
                                        group/pill
                                    `}
                                >
                                    {/* Outer glow ring */}
                                    <span className={`absolute -inset-[1px] rounded-xl ${toneStyles.pillBorder} opacity-40 blur-[2px]`} style={{ animation: 'notif-pulse-glow 2.5s ease-in-out infinite' }} />
                                    {/* Inner glow */}
                                    <span className={`absolute inset-0 rounded-xl ${toneStyles.pillBorder} opacity-20`} style={{ animation: 'notif-pulse-glow 2s ease-in-out infinite 0.5s' }} />
                                    {/* Animated dot */}
                                    <span className={`relative w-2 h-2 rounded-full ${toneStyles.dot} flex-shrink-0`} style={{ animation: 'notif-dot-pulse 1.8s ease-in-out infinite' }}>
                                        <span className={`absolute inset-0 rounded-full ${toneStyles.dot} blur-[2px] animate-pulse`} />
                                    </span>
                                    <span className="relative z-10">{active.accent}</span>
                                </span>

                                {/* Animated message with premium typography */}
                                <div className="relative flex-1 min-w-0 h-[24px] overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={active.id}
                                            initial={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
                                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                            exit={{ y: -24, opacity: 0, filter: 'blur(6px)' }}
                                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            className="absolute inset-0 flex items-center gap-3"
                                        >
                                            {/* Icon container with gradient background */}
                                            <span className={`relative flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${toneStyles.iconBg}`}>
                                                <Icon className={`w-3.5 h-3.5 ${toneStyles.icon}`} />
                                                <span className={`absolute inset-0 rounded-lg ${toneStyles.iconGlow}`} />
                                            </span>
                                            <span className={`truncate text-[13.5px] font-semibold tracking-[0.01em] leading-tight ${toneStyles.text}`}>
                                                {active.text}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* CTA button — premium with glow */}
                                {active.cta && (
                                    <motion.button
                                        onClick={active.cta.action}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`
                                            hidden md:inline-flex items-center gap-2
                                            px-5 py-2 rounded-xl
                                            text-[11px] font-bold uppercase tracking-[0.14em]
                                            ${toneStyles.cta}
                                            transition-all duration-300
                                            relative overflow-hidden
                                            group/cta
                                        `}
                                    >
                                        {/* CTA shine sweep */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                                        {/* Outer glow on hover */}
                                        <span className={`absolute -inset-[2px] rounded-xl ${toneStyles.ctaGlow} opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300 blur-md`} />
                                        <span className="relative flex items-center gap-2">
                                            <Star className="w-3.5 h-3.5" />
                                            {active.cta.label}
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
                                        </span>
                                    </motion.button>
                                )}
                            </div>

                            {/* ─── Right: progress dots + timestamp + dismiss ─── */}
                            <div className="flex items-center gap-4 flex-shrink-0">

                                {/* Progress dots — enhanced */}
                                {!isMobile && messages.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        {messages.map((msg, i) => (
                                            <button
                                                key={msg.id}
                                                onClick={() => setIndex(i)}
                                                onMouseEnter={() => setHoveredDot(i)}
                                                onMouseLeave={() => setHoveredDot(null)}
                                                className="relative group/dot"
                                                aria-label={`Show message: ${msg.accent}`}
                                            >
                                                <span
                                                    className={`
                                                        block rounded-full transition-all duration-400 ease-out
                                                        ${i === index
                                                            ? 'w-6 h-[6px] bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.7)]'
                                                            : hoveredDot === i
                                                                ? 'w-4 h-[5px] bg-white/50 shadow-[0_0_6px_rgba(255,255,255,0.2)]'
                                                                : 'w-[6px] h-[5px] bg-white/15 hover:bg-white/35'
                                                        }
                                                    `}
                                                />
                                                {/* Glow ring on active dot */}
                                                {i === index && (
                                                    <span className="absolute inset-0 rounded-full bg-violet-400/30 blur-[3px] animate-pulse" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Separator */}
                                <span className="hidden sm:block w-[1px] h-4 bg-white/[0.08]" />

                                {/* Live timestamp */}
                                <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono text-white/45 tracking-[0.06em] font-medium">
                                    <Clock className="w-3.5 h-3.5 text-violet-400/50" />
                                    {now.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </span>

                                {/* Separator */}
                                <span className="hidden sm:block w-[1px] h-4 bg-white/[0.08]" />

                                {/* Dismiss button — premium */}
                                <button
                                    onClick={handleDismiss}
                                    aria-label="Dismiss notification"
                                    className="
                                        inline-flex items-center justify-center
                                        w-8 h-8 rounded-xl
                                        text-white/35 hover:text-white/90
                                        hover:bg-white/[0.06]
                                        border border-transparent hover:border-white/[0.08]
                                        transition-all duration-250
                                        group/close
                                    "
                                >
                                    <X className="w-4 h-4 transition-transform duration-200 group-hover/close:rotate-90" />
                                </button>
                            </div>
                        </div>

                        {/* ─── Progress bar with glow trail ─── */}
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] overflow-hidden">
                            {/* Background track */}
                            <div className="absolute inset-0 bg-white/[0.02]" />
                            {/* Subtle ambient track */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
                            {/* Progress fill with glow */}
                            <motion.div
                                className="absolute top-0 left-0 h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #c084fc)',
                                    boxShadow: '0 0 12px rgba(139,92,246,0.7), 0 0 24px rgba(139,92,246,0.3)',
                                }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.05, ease: 'linear' }}
                            />
                            {/* Glow trail behind the progress */}
                            <motion.div
                                className="absolute top-0 left-0 h-full rounded-full bg-violet-400/20 blur-[3px]"
                                initial={{ width: '0%' }}
                                animate={{ width: `${Math.min(progress + 3, 100)}%` }}
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
                    100% { background-position: 300% 0; }
                }
                @keyframes notif-border-flow-reverse {
                    0%   { background-position: 250% 0; }
                    100% { background-position: 0% 0; }
                }
                @keyframes notif-pulse-glow {
                    0%, 100% { opacity: 0.25; transform: scale(1); }
                    50%      { opacity: 0.7; transform: scale(1.03); }
                }
                @keyframes notif-dot-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.5; transform: scale(0.7); }
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
                pill: 'bg-emerald-500/12 text-emerald-300 border border-emerald-400/20',
                pillBorder: 'bg-gradient-to-r from-emerald-400/30 to-teal-400/30',
                dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]',
                icon: 'text-emerald-300',
                iconBg: 'bg-emerald-500/10 border border-emerald-400/15',
                iconGlow: 'bg-emerald-400/10 blur-[2px]',
                text: 'text-white/92',
                cta: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/20',
                ctaGlow: 'bg-emerald-400/20'
            };
        case 'gold':
            return {
                pill: 'bg-amber-500/12 text-amber-200 border border-amber-400/20',
                pillBorder: 'bg-gradient-to-r from-amber-400/30 to-orange-400/30',
                dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]',
                icon: 'text-amber-300',
                iconBg: 'bg-amber-500/10 border border-amber-400/15',
                iconGlow: 'bg-amber-400/10 blur-[2px]',
                text: 'text-amber-50/95',
                cta: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold border border-amber-300/30 shadow-[0_4px_20px_rgba(251,191,36,0.35)]',
                ctaGlow: 'bg-amber-400/30'
            };
        case 'violet':
            return {
                pill: 'bg-violet-500/12 text-violet-200 border border-violet-400/20',
                pillBorder: 'bg-gradient-to-r from-violet-400/30 to-purple-400/30',
                dot: 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,1)]',
                icon: 'text-violet-300',
                iconBg: 'bg-violet-500/10 border border-violet-400/15',
                iconGlow: 'bg-violet-400/10 blur-[2px]',
                text: 'text-white/92',
                cta: 'bg-violet-500/15 hover:bg-violet-500/25 text-violet-200 border border-violet-400/20',
                ctaGlow: 'bg-violet-400/20'
            };
        case 'cyan':
            return {
                pill: 'bg-cyan-500/12 text-cyan-200 border border-cyan-400/20',
                pillBorder: 'bg-gradient-to-r from-cyan-400/30 to-sky-400/30',
                dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]',
                icon: 'text-cyan-300',
                iconBg: 'bg-cyan-500/10 border border-cyan-400/15',
                iconGlow: 'bg-cyan-400/10 blur-[2px]',
                text: 'text-white/92',
                cta: 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/20',
                ctaGlow: 'bg-cyan-400/20'
            };
        case 'emerald':
            return {
                pill: 'bg-emerald-500/12 text-emerald-200 border border-emerald-400/20',
                pillBorder: 'bg-gradient-to-r from-emerald-400/30 to-green-400/30',
                dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]',
                icon: 'text-emerald-300',
                iconBg: 'bg-emerald-500/10 border border-emerald-400/15',
                iconGlow: 'bg-emerald-400/10 blur-[2px]',
                text: 'text-white/92',
                cta: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-400/20',
                ctaGlow: 'bg-emerald-400/20'
            };
        case 'info':
            return {
                pill: 'bg-blue-500/12 text-blue-200 border border-blue-400/20',
                pillBorder: 'bg-gradient-to-r from-blue-400/30 to-indigo-400/30',
                dot: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]',
                icon: 'text-blue-300',
                iconBg: 'bg-blue-500/10 border border-blue-400/15',
                iconGlow: 'bg-blue-400/10 blur-[2px]',
                text: 'text-white/92',
                cta: 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 border border-blue-400/20',
                ctaGlow: 'bg-blue-400/20'
            };
        case 'warning':
            return {
                pill: 'bg-orange-500/12 text-orange-200 border border-orange-400/20',
                pillBorder: 'bg-gradient-to-r from-orange-400/30 to-red-400/30',
                dot: 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,1)]',
                icon: 'text-orange-300',
                iconBg: 'bg-orange-500/10 border border-orange-400/15',
                iconGlow: 'bg-orange-400/10 blur-[2px]',
                text: 'text-orange-50/95',
                cta: 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-200 border border-orange-400/20',
                ctaGlow: 'bg-orange-400/20'
            };
        case 'gradient':
        default:
            return {
                pill: 'bg-indigo-500/12 text-indigo-200 border border-indigo-400/20',
                pillBorder: 'bg-gradient-to-r from-indigo-400/30 via-violet-400/30 to-purple-400/30',
                dot: 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,1)]',
                icon: 'text-indigo-300',
                iconBg: 'bg-indigo-500/10 border border-indigo-400/15',
                iconGlow: 'bg-indigo-400/10 blur-[2px]',
                text: 'text-white/92',
                cta: 'bg-gradient-to-r from-indigo-500/15 via-violet-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:via-violet-500/25 hover:to-purple-500/25 text-indigo-200 border border-indigo-400/20',
                ctaGlow: 'bg-indigo-400/20'
            };
    }
};

export default PremiumNotificationBar;
