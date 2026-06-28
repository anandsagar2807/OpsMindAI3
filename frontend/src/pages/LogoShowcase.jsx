import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   LOGO 1 — "Neural Mind"
   A brain/neural-network formed by connected glowing nodes inside
   a gradient rounded square. Represents AI + intelligence.
   ═══════════════════════════════════════════════════════════════ */
function LogoNeuralMind({ size = 120 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="nm-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="0.5" stopColor="#7C3AED" />
                    <stop offset="1" stopColor="#4F46E5" />
                </linearGradient>
                <linearGradient id="nm-glow" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C4B5FD" />
                    <stop offset="1" stopColor="#818CF8" />
                </linearGradient>
                <filter id="nm-blur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" />
                </filter>
            </defs>
            {/* Rounded square background */}
            <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#nm-bg)" />
            <rect x="6" y="6" width="108" height="108" rx="28" fill="black" fillOpacity="0.08" />
            {/* Neural network nodes & connections */}
            <g stroke="url(#nm-glow)" strokeWidth="1.5" strokeOpacity="0.55" strokeLinecap="round">
                <line x1="40" y1="38" x2="60" y2="32" />
                <line x1="60" y1="32" x2="80" y2="38" />
                <line x1="40" y1="38" x2="34" y2="60" />
                <line x1="80" y1="38" x2="86" y2="60" />
                <line x1="34" y1="60" x2="60" y2="60" />
                <line x1="86" y1="60" x2="60" y2="60" />
                <line x1="34" y1="60" x2="42" y2="82" />
                <line x1="86" y1="60" x2="78" y2="82" />
                <line x1="42" y1="82" x2="60" y2="88" />
                <line x1="78" y1="82" x2="60" y2="88" />
                <line x1="60" y1="32" x2="60" y2="60" />
                <line x1="60" y1="60" x2="60" y2="88" />
            </g>
            {/* Nodes */}
            <g fill="#E0E7FF" filter="url(#nm-blur)">
                <circle cx="40" cy="38" r="4" />
                <circle cx="60" cy="32" r="5" />
                <circle cx="80" cy="38" r="4" />
                <circle cx="34" cy="60" r="4" />
                <circle cx="86" cy="60" r="4" />
                <circle cx="60" cy="60" r="6" />
                <circle cx="42" cy="82" r="4" />
                <circle cx="78" cy="82" r="4" />
                <circle cx="60" cy="88" r="5" />
            </g>
            <g fill="#F5F3FF">
                <circle cx="40" cy="38" r="3" />
                <circle cx="60" cy="32" r="3.5" />
                <circle cx="80" cy="38" r="3" />
                <circle cx="34" cy="60" r="3" />
                <circle cx="86" cy="60" r="3" />
                <circle cx="60" cy="60" r="4.5" fill="#A78BFA" />
                <circle cx="42" cy="82" r="3" />
                <circle cx="78" cy="82" r="3" />
                <circle cx="60" cy="88" r="3.5" />
            </g>
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOGO 2 — "Orbit Core"
   Concentric orbital rings with a glowing central core.
   Knowledge revolving around a central intelligence.
   ═══════════════════════════════════════════════════════════════ */
function LogoOrbitCore({ size = 120 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="oc-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0F172A" />
                    <stop offset="1" stopColor="#1E1B4B" />
                </linearGradient>
                <radialGradient id="oc-core" cx="0.5" cy="0.5" r="0.5">
                    <stop stopColor="#F0ABFC" />
                    <stop offset="0.5" stopColor="#A855F7" />
                    <stop offset="1" stopColor="#6366F1" />
                </radialGradient>
                <linearGradient id="oc-ring" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818CF8" />
                    <stop offset="1" stopColor="#C084FC" />
                </linearGradient>
            </defs>
            <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#oc-bg)" />
            {/* Outer ring */}
            <ellipse cx="60" cy="60" rx="38" ry="16" stroke="url(#oc-ring)" strokeWidth="2" strokeOpacity="0.4" transform="rotate(-30 60 60)" />
            {/* Middle ring */}
            <ellipse cx="60" cy="60" rx="38" ry="16" stroke="url(#oc-ring)" strokeWidth="2.5" strokeOpacity="0.65" transform="rotate(30 60 60)" />
            {/* Inner ring */}
            <circle cx="60" cy="60" r="30" stroke="url(#oc-ring)" strokeWidth="2" strokeOpacity="0.5" />
            {/* Orbiting nodes */}
            <circle cx="60" cy="22" r="3.5" fill="#C4B5FD" />
            <circle cx="92" cy="74" r="3" fill="#A78BFA" />
            <circle cx="28" cy="46" r="2.5" fill="#818CF8" />
            {/* Glowing core */}
            <circle cx="60" cy="60" r="14" fill="url(#oc-core)" />
            <circle cx="60" cy="60" r="14" fill="white" fillOpacity="0.15" />
            <circle cx="56" cy="56" r="4" fill="white" fillOpacity="0.5" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOGO 3 — "Hex Prism"
   A hexagonal prism with inner geometric lines forming an
   abstract "M" for Mind. Structured, technical, premium.
   ═══════════════════════════════════════════════════════════════ */
function LogoHexPrism({ size = 120 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="hp-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5" />
                    <stop offset="0.5" stopColor="#7C3AED" />
                    <stop offset="1" stopColor="#9333EA" />
                </linearGradient>
                <linearGradient id="hp-hex" x1="30" y1="20" x2="90" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F5F3FF" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#C4B5FD" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="hp-m" x1="40" y1="40" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#312E81" />
                    <stop offset="1" stopColor="#5B21B6" />
                </linearGradient>
            </defs>
            <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#hp-bg)" />
            <rect x="6" y="6" width="108" height="108" rx="28" fill="black" fillOpacity="0.1" />
            {/* Hexagon outline */}
            <path
                d="M60 22 L94 42 L94 78 L60 98 L26 78 L26 42 Z"
                stroke="url(#hp-hex)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="white"
                fillOpacity="0.08"
            />
            {/* Inner hexagon (smaller) */}
            <path
                d="M60 34 L84 48 L84 72 L60 86 L36 72 L36 48 Z"
                stroke="url(#hp-hex)"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                strokeLinejoin="round"
            />
            {/* Abstract "M" formed by geometric lines */}
            <path
                d="M44 74 L44 50 L60 62 L76 50 L76 74"
                stroke="url(#hp-m)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Prism light reflection */}
            <path d="M60 22 L60 34" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            <path d="M94 42 L84 48" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            <path d="M26 42 L36 48" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOGO 4 — "Pulse O"
   An "O" formed by a signal/pulse wave. Represents operations
   monitoring, real-time intelligence, and the "Ops" in OpsMind.
   ═══════════════════════════════════════════════════════════════ */
function LogoPulseO({ size = 120 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="po-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0EA5E9" />
                    <stop offset="0.5" stopColor="#6366F1" />
                    <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="po-wave" x1="20" y1="60" x2="100" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#67E8F9" />
                    <stop offset="0.5" stopColor="#A5B4FC" />
                    <stop offset="1" stopColor="#D8B4FE" />
                </linearGradient>
            </defs>
            <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#po-bg)" />
            <rect x="6" y="6" width="108" height="108" rx="28" fill="black" fillOpacity="0.08" />
            {/* Outer "O" ring */}
            <circle cx="60" cy="60" r="34" stroke="white" strokeOpacity="0.15" strokeWidth="3" />
            {/* Pulse wave cutting through the O */}
            <path
                d="M26 60 Q34 60 38 50 Q42 40 46 60 Q50 80 54 60 Q58 40 62 60 Q66 80 70 60 Q74 40 78 50 Q82 60 94 60"
                stroke="url(#po-wave)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Glow dots at wave peaks */}
            <circle cx="46" cy="60" r="2.5" fill="#67E8F9" />
            <circle cx="62" cy="60" r="2.5" fill="#A5B4FC" />
            <circle cx="78" cy="50" r="2" fill="#D8B4FE" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOGO 5 — "Aperture Insight"
   An aperture/iris mechanism forming a lens. Represents focus,
   clarity, and insight — the "Mind" that sees and understands.
   ═══════════════════════════════════════════════════════════════ */
function LogoApertureInsight({ size = 120 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ai-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1E1B4B" />
                    <stop offset="0.5" stopColor="#312E81" />
                    <stop offset="1" stopColor="#4C1D95" />
                </linearGradient>
                <linearGradient id="ai-blade1" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#818CF8" />
                    <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="ai-blade2" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#A78BFA" />
                    <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
                <linearGradient id="ai-blade3" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#C4B5FD" />
                    <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
                <radialGradient id="ai-center" cx="0.5" cy="0.5" r="0.5">
                    <stop stopColor="#F0ABFC" />
                    <stop offset="1" stopColor="#7C3AED" />
                </radialGradient>
            </defs>
            <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#ai-bg)" />
            {/* Aperture blades (6 blades forming iris) */}
            <g transform="translate(60 60)">
                {/* Blade 1 */}
                <path d="M0 -36 L20 -10 L0 0 Z" fill="url(#ai-blade1)" opacity="0.9" />
                {/* Blade 2 */}
                <path d="M31 -18 L31 18 L0 0 Z" fill="url(#ai-blade2)" opacity="0.85" transform="rotate(0)" />
                {/* Blade 3 */}
                <path d="M20 10 L0 36 L0 0 Z" fill="url(#ai-blade3)" opacity="0.9" />
                {/* Blade 4 */}
                <path d="M-20 10 L-31 -18 L0 0 Z" fill="url(#ai-blade1)" opacity="0.8" />
                {/* Blade 5 */}
                <path d="M-31 18 L-20 -10 L0 0 Z" fill="url(#ai-blade2)" opacity="0.85" />
                {/* Blade 6 */}
                <path d="M-20 -10 L20 -10 L0 0 Z" fill="url(#ai-blade3)" opacity="0.75" />
            </g>
            {/* Outer ring */}
            <circle cx="60" cy="60" r="36" stroke="#A78BFA" strokeOpacity="0.3" strokeWidth="1.5" fill="none" />
            {/* Center glow */}
            <circle cx="60" cy="60" r="8" fill="url(#ai-center)" />
            <circle cx="58" cy="58" r="3" fill="white" fillOpacity="0.6" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════════════════
   LOGO DATA
   ═══════════════════════════════════════════════════════════════ */
const LOGOS = [
    {
        id: 1,
        name: 'Neural Mind',
        tagline: 'AI Intelligence',
        description: 'A neural network of connected glowing nodes forming a brain-like structure. Symbolizes artificial intelligence and interconnected knowledge.',
        Component: LogoNeuralMind,
        accent: 'from-indigo-500 to-violet-600',
    },
    {
        id: 2,
        name: 'Orbit Core',
        tagline: 'Knowledge Hub',
        description: 'Concentric orbital rings with a radiant central core. Represents knowledge revolving around a central intelligence — your operations hub.',
        Component: LogoOrbitCore,
        accent: 'from-purple-500 to-indigo-600',
    },
    {
        id: 3,
        name: 'Hex Prism',
        tagline: 'Structured Intelligence',
        description: 'A hexagonal prism with an abstract "M" for Mind. Conveys structure, precision, and technical sophistication.',
        Component: LogoHexPrism,
        accent: 'from-violet-500 to-purple-700',
    },
    {
        id: 4,
        name: 'Pulse O',
        tagline: 'Operations Pulse',
        description: 'An "O" formed by a signal pulse wave. Captures real-time operations monitoring and the "Ops" in OpsMind.',
        Component: LogoPulseO,
        accent: 'from-sky-500 to-violet-600',
    },
    {
        id: 5,
        name: 'Aperture Insight',
        tagline: 'Focus & Clarity',
        description: 'An aperture/iris mechanism forming a lens. Symbolizes focus, clarity, and the insight that comes from understanding your documents.',
        Component: LogoApertureInsight,
        accent: 'from-indigo-600 to-purple-800',
    },
];

/* ═══════════════════════════════════════════════════════════════
   SHOWCASE PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LogoShowcase() {
    const [selected, setSelected] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (name) => {
        navigator.clipboard?.writeText(name);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#080c14] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                        <span className="text-sm font-medium text-violet-300">Brand Identity</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-violet-200 to-indigo-300 bg-clip-text text-transparent mb-4">
                        OpsMind AI — Logo Concepts
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Five distinct logo directions for your brand. Each is a crisp, scalable SVG.
                        Click a logo to preview it in context.
                    </p>
                </motion.div>

                {/* Logo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {LOGOS.map((logo, index) => {
                        const { Component } = logo;
                        const isSelected = selected === logo.id;
                        return (
                            <motion.div
                                key={logo.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -6 }}
                                onClick={() => setSelected(isSelected ? null : logo.id)}
                                className={`relative cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden group
                  ${isSelected
                                        ? 'border-violet-500/60 bg-violet-500/[0.06] shadow-[0_0_40px_rgba(139,92,246,0.15)]'
                                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                                    }`}
                            >
                                {/* Selected badge */}
                                {isSelected && (
                                    <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                {/* Logo display area */}
                                <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6">
                                    <div className="relative">
                                        {/* Glow behind logo */}
                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${logo.accent} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                                        <div className="relative">
                                            <Component size={120} />
                                        </div>
                                    </div>

                                    {/* Logo name + tagline */}
                                    <div className="mt-6 text-center">
                                        <h3 className="text-xl font-bold text-white tracking-tight">{logo.name}</h3>
                                        <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${logo.accent} bg-clip-text text-transparent border border-white/10`}>
                                            {logo.tagline}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="px-6 pb-6">
                                    <p className="text-sm text-gray-400 leading-relaxed text-center">
                                        {logo.description}
                                    </p>
                                </div>

                                {/* In-app context preview (logo + wordmark) */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-center gap-3 py-4 rounded-xl bg-black/30 border border-white/[0.04]">
                                        <Component size={36} />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-[15px] tracking-tight leading-none">OpsMind</span>
                                            <span className="text-violet-400/70 text-[10px] font-medium leading-none mt-1">Enterprise AI</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] to-transparent flex flex-col items-center justify-center p-10 text-center"
                    >
                        <h3 className="text-2xl font-bold text-white mb-3">Found your favorite?</h3>
                        <p className="text-gray-400 mb-6 max-w-xs">
                            Tell me which logo number you like and I'll integrate it across the entire app — sidebar, header, auth pages, and favicon.
                        </p>
                        <button
                            onClick={() => handleCopy('Logo selected')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Noted!' : 'Pick a logo'}
                        </button>
                    </motion.div>
                </div>

                {/* Selected detail banner */}
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/[0.08] via-indigo-500/[0.04] to-transparent p-8 flex flex-col md:flex-row items-center gap-8"
                    >
                        {(() => {
                            const logo = LOGOS.find(l => l.id === selected);
                            const { Component } = logo;
                            return (
                                <>
                                    <div className="relative shrink-0">
                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${logo.accent} blur-3xl opacity-30`} />
                                        <Component size={100} />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/25">
                                                #{logo.id} SELECTED
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-extrabold text-white mb-2">{logo.name}</h2>
                                        <p className="text-gray-400">{logo.description}</p>
                                    </div>
                                    <div className="flex flex-col gap-3 shrink-0">
                                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black/40 border border-white/[0.06]">
                                            <Component size={32} />
                                            <span className="font-bold text-white text-sm">OpsMind AI</span>
                                        </div>
                                        <p className="text-xs text-gray-500 text-center">Sidebar preview</p>
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                )}

                {/* Footer */}
                <div className="text-center mt-16 text-sm text-gray-600">
                    <p>All logos are pure SVG — infinitely scalable, no image files needed.</p>
                </div>
            </div>
        </div>
    );
}
