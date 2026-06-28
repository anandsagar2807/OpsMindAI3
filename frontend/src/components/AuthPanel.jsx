import { Brain, Zap, Shield, Sparkles } from 'lucide-react'
import LogoNeuralMind from './Logo'

const features = [
    {
        icon: Brain,
        title: 'Intelligent RAG',
        description: 'Context-aware answers from your documents with zero hallucinations',
    },
    {
        icon: Zap,
        title: 'Real-Time Streaming',
        description: 'ChatGPT-quality responses with lightning-fast streaming',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Role-based access control with SOC 2 compliance',
    },
]

export default function AuthPanel({ heading = 'Welcome back to', highlight = 'OpsMind', description }) {
    return (
        <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 relative overflow-hidden bg-[#0a0a18] pt-20">
            {/* ─── Ambient gradient overlays ─── */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-transparent to-purple-900/20" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />

            {/* ─── Subtle grid pattern ─── */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.4) 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
            }} />

            {/* ─── Top accent line ─── */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {/* ─── Content ─── */}
            <div className="relative z-10 max-w-lg">
                {/* Brand — increased gap below (mb-16 = 64px) */}
                <div className="flex items-center gap-4 mb-16">
                    {/* Premium logo container */}
                    <div className="relative">
                        {/* Outer glow ring */}
                        <div className="absolute -inset-3 rounded-2xl bg-indigo-500/10 blur-xl" />
                        {/* Pulsing ring */}
                        <div className="absolute -inset-2 rounded-2xl border border-indigo-400/20 animate-pulse" />
                        {/* Neural Mind Logo */}
                        <div className="relative">
                            <LogoNeuralMind size={52} />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-white font-extrabold text-xl leading-tight tracking-[-0.02em]">
                            OpsMind AI
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                            <p className="text-indigo-400/80 text-[10px] tracking-[0.2em] font-bold uppercase">
                                Enterprise Knowledge AI
                            </p>
                        </div>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-white text-3xl xl:text-[40px] font-extrabold leading-[1.1] mb-5 tracking-[-0.02em]">
                    {heading}
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x">
                        {highlight}
                    </span>
                </h1>

                {/* Description */}
                <p className="text-gray-400/90 text-[15px] leading-relaxed mb-10 max-w-md">
                    {description ||
                        'Sign in to access your AI-powered knowledge assistant, upload documents, and get instant answers with source citations.'}
                </p>

                {/* Feature cards */}
                <div className="space-y-4">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-indigo-400/30 transition-all duration-300">
                                <feature.icon className="w-[18px] h-[18px] text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-[14px] tracking-[-0.01em]">{feature.title}</h3>
                                <p className="text-gray-400/70 text-[13px] leading-relaxed mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom decorative line */}
                <div className="mt-12 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>
        </div>
    )
}