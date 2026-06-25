import { SignUp, useAuth as useClerkAuth } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ArrowRight, Loader2, Sparkles, Shield } from 'lucide-react'
import AuthPanel from '../components/AuthPanel'

// Premium dark-themed sign-up page — dark content panel on the left, Clerk form on the right
export default function SignUpPage() {
    const { isSignedIn, isLoaded, signOut } = useClerkAuth()
    const navigate = useNavigate()

    // Clerk is still loading — show a clean spinner
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex bg-[#0a0a0f]">
                <div className="flex-1">
                    <AuthPanel
                        heading="Get started with"
                        highlight="OpsMind"
                        description="Create your account to unlock AI-powered knowledge management, document analysis, and instant answers with source citations."
                    />
                </div>
                <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
                    {/* Animated glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/8 rounded-full blur-2xl" />
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                        <p className="text-[13px] text-gray-500 font-medium">Loading authentication...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Already signed in — show dashboard redirect + sign‑out option
    if (isSignedIn) {
        return (
            <div className="min-h-screen flex bg-[#0a0a0f]">
                <div className="flex-1">
                    <AuthPanel
                        heading="Get started with"
                        highlight="OpsMind"
                        description="Create your account to unlock AI-powered knowledge management, document analysis, and instant answers with source citations."
                    />
                </div>
                <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
                    {/* Animated glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/8 rounded-full blur-2xl" />

                    <div className="w-full max-w-sm text-center relative z-10 px-6">
                        <div className="relative inline-flex mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 ring-1 ring-white/[0.08]">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                                <Shield className="w-3 h-3 text-emerald-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2 tracking-[-0.02em]">You're already signed in</h2>
                        <p className="text-[14px] text-gray-400/80 mb-8 leading-relaxed">
                            Your session is active. Go to your dashboard or sign out to create a new account.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={async () => {
                                    await signOut()
                                    window.location.reload()
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/[0.06] rounded-xl transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out & create new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Not signed in — show the Clerk form
    return (
        <div className="min-h-screen flex bg-[#0a0a0f]">
            {/* Left: Dark content panel */}
            <div className="flex-1">
                <AuthPanel
                    heading="Get started with"
                    highlight="OpsMind"
                    description="Create your account to unlock AI-powered knowledge management, document analysis, and instant answers with source citations."
                />
            </div>

            {/* Right: Premium Clerk Sign-Up form area */}
            <div className="flex-1 flex items-center justify-center py-12 px-8 bg-[#0a0a0f] relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/6 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.3) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }} />

                <div className="relative z-10 w-full max-w-md">
                    {/* Clerk Sign-Up component */}
                    <SignUp
                        routing="path"
                        path="/sign-up"
                        signInUrl="/sign-in"
                        forceRedirectUrl="/dashboard"
                        appearance={{
                            layout: {
                                socialButtonsPlacement: 'bottom',
                                socialButtonsVariant: 'iconButton',
                            },
                            elements: {
                                headerTitle: {
                                    fontSize: '1.75rem',
                                    fontWeight: '800',
                                    letterSpacing: '-0.03em',
                                    color: '#fff',
                                },
                                footer: {
                                    marginTop: '24px',
                                },
                                formButtonPrimary: {
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed) !important',
                                    borderRadius: '12px !important',
                                    fontSize: '14px !important',
                                    fontWeight: '600 !important',
                                    padding: '12px 24px !important',
                                    color: '#fff !important',
                                    boxShadow: '0 4px 20px rgba(139,92,246,0.25) !important',
                                    border: 'none !important',
                                    textShadow: 'none !important',
                                    lineHeight: '1.5 !important',
                                    ':hover': {
                                        background: 'linear-gradient(135deg, #a78bfa, #8b5cf6) !important',
                                        boxShadow: '0 8px 30px rgba(139,92,246,0.4) !important',
                                        transform: 'translateY(-1px)',
                                    },
                                    ':disabled': {
                                        opacity: '0.5 !important',
                                        cursor: 'not-allowed !important',
                                    },
                                },
                                card: {
                                    background: 'rgba(255,255,255,0.04)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                },
                                headerSubtitle: {
                                    color: 'rgba(156,163,175,0.8)',
                                },
                                dividerLine: {
                                    background: 'rgba(255,255,255,0.06)',
                                },
                                dividerText: {
                                    color: 'rgba(107,114,128,0.8)',
                                },
                                socialButtonsBlockButton: {
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px',
                                    color: 'rgba(209,213,219,0.9)',
                                },
                                formFieldLabel: {
                                    color: 'rgba(209,213,219,0.9)',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                },
                                formFieldInput: {
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    padding: '12px 16px',
                                },
                                footerActionLink: {
                                    color: 'rgba(139,92,246,0.9)',
                                },
                                formFieldInputShowPasswordButton: {
                                    color: 'rgba(107,114,128,0.8)',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
