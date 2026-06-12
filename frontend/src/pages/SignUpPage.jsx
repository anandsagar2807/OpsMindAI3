import { SignUp, useAuth as useClerkAuth } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ArrowRight, Loader2 } from 'lucide-react'
import AuthPanel from '../components/AuthPanel'

// Premium light-themed sign-up page — dark content panel on the left, Clerk form on the right
export default function SignUpPage() {
    const { isSignedIn, isLoaded, signOut } = useClerkAuth()
    const navigate = useNavigate()

    // Clerk is still loading — show a clean spinner
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex">
                <div className="flex-1">
                    <AuthPanel
                        heading="Get started with"
                        highlight="OpsMind"
                        description="Create your account to unlock AI-powered knowledge management, document analysis, and instant answers with source citations."
                    />
                </div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white via-slate-50/30 to-white relative overflow-hidden">
                    {/* Subtle decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50/30 rounded-full blur-2xl" />
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-sm text-neutral-400 font-medium">Loading authentication...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Already signed in — show dashboard redirect + sign‑out option
    if (isSignedIn) {
        return (
            <div className="min-h-screen flex">
                <div className="flex-1">
                    <AuthPanel
                        heading="Get started with"
                        highlight="OpsMind"
                        description="Create your account to unlock AI-powered knowledge management, document analysis, and instant answers with source citations."
                    />
                </div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white via-slate-50/30 to-white relative overflow-hidden">
                    {/* Subtle decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50/30 rounded-full blur-2xl" />

                    <div className="w-full max-w-sm text-center relative z-10">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-neutral-800 mb-2 tracking-[-0.02em]">You're already signed in</h2>
                        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                            Your session is active. Go to your dashboard or sign out to create a new account.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={async () => {
                                    await signOut()
                                    window.location.reload()
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-neutral-400 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200"
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
        <div className="min-h-screen flex">
            {/* Left: Dark content panel */}
            <div className="flex-1">
                <AuthPanel
                    heading="Get started with"
                    highlight="OpsMind"
                    description="Create your account to unlock AI-powered knowledge management, document analysis, and instant answers with source citations."
                />
            </div>

            {/* Right: Premium Clerk Sign-Up form area */}
            <div className="flex-1 flex items-center justify-center py-12 px-8 bg-gradient-to-br from-white via-slate-50/20 to-white relative overflow-hidden">
                {/* ─── Subtle decorative background ─── */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50/40 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-50/20 rounded-full blur-3xl" />
                {/* Subtle dot pattern */}
                <div className="absolute inset-0 opacity-[0.015]" style={{
                    backgroundImage: `radial-gradient(circle, rgba(99,102,241,0.3) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }} />

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
                            },
                            footer: {
                                marginTop: '24px',
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}