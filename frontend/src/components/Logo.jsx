export default function LogoNeuralMind({ size = 40 }) {
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
            <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#nm-bg)" />
            <rect x="6" y="6" width="108" height="108" rx="28" fill="black" fillOpacity="0.08" />
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
