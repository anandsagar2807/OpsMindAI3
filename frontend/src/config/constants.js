export const API_CONFIG = {
    BASE_URL_DEV: '',
    // Production backend hosted on Render. Can be overridden via VITE_API_URL
    // environment variable in Vercel if needed.
    BASE_URL_PROD: import.meta.env.VITE_API_URL || 'https://opsmindai3.onrender.com',
    TIMEOUT: 30000,
    UPLOAD_TIMEOUT: 120000,
};

export const COLORS = {
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

export const FILE_LIMITS = {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_FILES: 5,
    ACCEPTED_TYPES: { 'application/pdf': ['.pdf'] },
};

export const STATUS_LABELS = {
    completed: 'Ready',
    failed: 'Failed',
    uploading: 'Uploading...',
    processing: 'Processing...',
    chunking: 'Chunking...',
    embedding: 'Embedding...',
};