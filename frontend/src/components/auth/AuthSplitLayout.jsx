import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

const AuthSplitLayout = ({ children, mode = 'register' }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-black text-white">
            {/* Animated gradient overlays */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.35),transparent_60%)] blur-3xl animate-pulse-premium" />
                <div className="absolute -bottom-24 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.28),transparent_62%)] blur-3xl animate-pulse-slow" />
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_20%_10%,rgba(168,85,247,0.18),transparent_35%)]" />
            </div>

            {/* Subtle particles */}
            <div className="pointer-events-none absolute inset-0 opacity-80">
                {Array.from({ length: 18 }).map((_, i) => {
                    const left = (i * 37) % 100
                    const top = (i * 19) % 100
                    const delay = (i % 6) * 0.15
                    const size = 2 + (i % 3)
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/20 blur-[0.5px] animate-float-slow"
                            style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                                animationDelay: `${delay}s`,
                            }}
                        />
                    )
                })}
            </div>

            <div className="relative z-10">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-stretch">
                        {/* Left branding panel (40%) */}
                        <motion.section
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="lg:w-[40%] w-full"
                        >
                            <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass-card p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                                <div className="space-y-7">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-glass-blur">
                                            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.6),transparent_58%)] blur-xl" />
                                            <Brain className="relative w-7 h-7 text-purple-200" />
                                            <div className="absolute -top-2 -right-2 rounded-full bg-white/10 border border-white/10 p-2">
                                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-400 shadow-glow" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
                                                OpsMind <span className="text-transparent bg-gradient-to-r from-fuchsia-300 via-purple-300 to-indigo-300 bg-clip-text">AI</span>
                                            </div>
                                            <div className="text-sm sm:text-base text-white/70 font-medium mt-1">
                                                Corporate Knowledge Brain
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-white/80 leading-relaxed">
                                        Transform your organization&apos;s knowledge into actionable intelligence with our AI-powered enterprise platform.
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 pt-2">
                                        <FeatureItem text="AI-powered insights" />
                                        <FeatureItem text="Secure enterprise data" />
                                        <FeatureItem text="Seamless integrations" />
                                    </div>
                                </div>

                                <div className="pt-6 text-xs sm:text-sm text-white/55">
                                    {mode === 'login' ? 'Welcome back.' : 'Start building with confidence.'}
                                    <div className="mt-2 h-px w-full bg-white/10" />
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-indigo-400" />
                                        <span>Premium authentication experience • Powered by Clerk</span>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Right auth area (60%) */}
                        <motion.section
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.04 }}
                            className="lg:w-[60%] w-full flex"
                        >
                            <div className="w-full flex items-center justify-center">
                                {children}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    )
}

const FeatureItem = ({ text }) => {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 shadow-glass-card">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 border border-white/10">
                <span className="text-transparent bg-gradient-to-r from-fuchsia-300 to-indigo-300 bg-clip-text font-bold">✔</span>
            </span>
            <span className="text-sm sm:text-base text-white/90 font-medium">{text}</span>
        </div>
    )
}

export default AuthSplitLayout
