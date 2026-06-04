import { motion } from 'framer-motion';
import { SignIn } from '@clerk/react';
import { Sparkles, Brain, Shield, Zap, ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';

export default function SignInPage() {
    const { isSignedIn } = useAuth();

    // If already signed in, redirect to dashboard
    if (isSignedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    const featureCards = [
        {
            icon: Brain,
            title: 'Intelligent RAG',
            desc: 'Context-aware answers from your documents with zero hallucinations',
        },
        {
            icon: Zap,
            title: 'Real-Time Streaming',
            desc: 'ChatGPT-quality responses with lightning-fast streaming',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            desc: 'Role-based access control with SOC 2 compliance',
        },
    ];

    const clerkAppearance = {
        variables: {
            colorPrimary: '#7C6BFF',
            colorBackground: 'transparent',
            colorText: '#F8FAFC',
            colorTextSecondary: 'rgba(255,255,255,0.7)',
            colorInputBackground: 'rgba(255,255,255,0.04)',
            colorInputText: '#F8FAFC',
            colorBorderPrimary: 'rgba(255,255,255,0.08)',
            borderRadius: '1rem',
            colorSuccess: '#2BCBFF',
            colorNeutral: '#94A3B8',
        },
        elements: {
            rootBox: 'w-full',
            card: 'bg-transparent border-0 shadow-none rounded-none w-full p-0',
            headerLogo: 'hidden',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton:
                'rounded-2xl border border-white/[0.08] bg-[rgba(255,255,255,0.04)] text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.08)] hover:border-white/[0.15] hover:shadow-[0_0_20px_rgba(124,107,255,0.15)] transition-all duration-300 h-[56px] font-medium',
            socialButtonsBlockButtonText: 'text-sm font-medium text-[#F8FAFC]',
            socialButtonsBlockButtonArrow: 'text-[#94A3B8]',
            dividerRow: 'my-6',
            dividerText: 'text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest font-semibold',
            dividerLine: 'bg-white/[0.06]',
            formButtonPrimary:
                'bg-gradient-to-r from-[#6C63FF] to-[#A855F7] hover:from-[#7C6BFF] hover:to-[#B86FFF] text-white font-bold text-sm rounded-[18px] shadow-[0_10px_30px_rgba(124,107,255,0.35)] hover:shadow-[0_14px_40px_rgba(124,107,255,0.5)] hover:scale-[1.02] transition-all duration-300 w-full h-[56px] tracking-wide border-0',
            formFieldLabel:
                'text-[rgba(255,255,255,0.5)] text-[11px] font-semibold uppercase tracking-[0.1em] mb-2',
            formFieldInput:
                'rounded-2xl bg-[rgba(255,255,255,0.04)] border border-white/[0.08] text-[#F8FAFC] placeholder-[rgba(255,255,255,0.25)] focus:border-[#7C6BFF] focus:ring-[4px] focus:ring-[rgba(124,107,255,0.15)] transition-all duration-300 h-[56px] px-5 text-sm',
            formFieldInputShowPasswordButton: 'text-[#94A3B8] hover:text-[#F8FAFC]',
            formFieldAction: 'text-[#7C6BFF] hover:text-[#2BCBFF] text-sm font-medium transition-colors',
            footer: 'bg-transparent border-0 mt-6 pt-0',
            footerActionText: 'text-[rgba(255,255,255,0.4)] text-sm',
            footerActionLink:
                'text-[#7C6BFF] hover:text-[#2BCBFF] font-medium text-sm transition-colors hover:underline',
            identityPreviewText: 'text-[#F8FAFC]',
            identityPreviewEditButton: 'text-[#7C6BFF] hover:text-[#2BCBFF]',
            alert: 'rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm',
            alertText: 'text-sm text-red-200',
            formFieldErrorText: 'text-red-400 text-xs mt-1',
            otpCodeFieldInput:
                'rounded-2xl bg-[rgba(255,255,255,0.04)] border border-white/[0.08] text-[#F8FAFC]',
            form: 'gap-5',
            formFieldRow: 'gap-1',
            formFieldsWrapper: 'gap-5',
        },
    };

    return (
        <div className="min-h-screen flex relative w-full overflow-hidden text-[#F8FAFC] animate-signin-page-fadein">
            {/* ─── LEFT PANEL (55%) ─── */}
            <div
                className="hidden lg:flex w-[55%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0"
                style={{
                    background:
                        'linear-gradient(180deg, #070B1A 0%, #0B1025 30%, #0D1735 60%, #0B1F4A 100%)',
                }}
            >
                {/* Blue radial glow behind content */}
                <div
                    className="absolute top-[20%] left-[30%] w-[40rem] h-[40rem] rounded-full pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(124,107,255,0.08) 0%, rgba(43,203,255,0.04) 40%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
                {/* Purple accent glow */}
                <div
                    className="absolute bottom-[10%] right-[5%] w-[28rem] h-[28rem] rounded-full pointer-events-none animate-float"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)',
                        filter: 'blur(50px)',
                    }}
                />
                {/* Soft blurred background shape */}
                <div
                    className="absolute top-[60%] left-[10%] w-[20rem] h-[20rem] rounded-full pointer-events-none animate-float-slow"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(43,203,255,0.04) 0%, transparent 50%)',
                        filter: 'blur(40px)',
                        animationDelay: '2s',
                    }}
                />
                {/* Decorative grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.015] pointer-events-none"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Left Panel Content */}
                <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    {/* ─── Top-left: Logo ─── */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
                            style={{
                                background:
                                    'linear-gradient(135deg, #7C6BFF 0%, #2BCBFF 100%)',
                                boxShadow: '0 8px 24px rgba(124,107,255,0.3)',
                            }}
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-[-0.02em] leading-tight">
                                OpsMind AI
                            </h1>
                            <p
                                className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                                style={{ color: '#7C6BFF' }}
                            >
                                Enterprise Knowledge AI
                            </p>
                        </div>
                    </div>

                    {/* ─── Hero Section ─── */}
                    <div className="my-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        >
                            <h2
                                className="text-4xl xl:text-5xl font-extrabold text-white mb-5 leading-[1.15] tracking-[-0.03em]"
                            >
                                Welcome back to{' '}
                                <span
                                    className="bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(135deg, #7C6BFF 0%, #2BCBFF 100%)',
                                    }}
                                >
                                    OpsMind
                                </span>
                            </h2>
                            <p
                                className="text-base xl:text-lg max-w-md leading-relaxed mb-10"
                                style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                                Sign in to access your AI-powered knowledge
                                assistant, upload documents, and get instant
                                answers with source citations.
                            </p>
                        </motion.div>

                        {/* ─── Feature Cards ─── */}
                        <div className="flex flex-col gap-4 max-w-lg">
                            {featureCards.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.3 + i * 0.12,
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                    className="group flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '24px',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        boxShadow:
                                            '0 4px 20px rgba(0,0,0,0.15)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor =
                                            'rgba(124,107,255,0.2)';
                                        e.currentTarget.style.boxShadow =
                                            '0 8px 30px rgba(124,107,255,0.1), 0 4px 20px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor =
                                            'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.boxShadow =
                                            '0 4px 20px rgba(0,0,0,0.15)';
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, rgba(124,107,255,0.12) 0%, rgba(43,203,255,0.08) 100%)',
                                            border: '1px solid rgba(124,107,255,0.15)',
                                        }}
                                    >
                                        <feature.icon
                                            className="w-5 h-5"
                                            style={{ color: '#7C6BFF' }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white/90 mb-1">
                                            {feature.title}
                                        </p>
                                        <p
                                            className="text-xs leading-relaxed"
                                            style={{
                                                color: 'rgba(255,255,255,0.55)',
                                            }}
                                        >
                                            {feature.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Back to homepage ─── */}
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm transition-colors duration-300 group"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = '#7C6BFF')
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                                'rgba(255,255,255,0.5)')
                            }
                        >
                            <ArrowLeft
                                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            Back to homepage
                        </Link>
                    </div>
                </div>
            </div>

            {/* ─── CENTER DIVIDER ─── */}
            <div
                className="hidden lg:block shrink-0"
                style={{
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            />

            {/* ─── RIGHT PANEL (45%) ─── */}
            <div
                className="flex-1 lg:w-[45%] flex flex-col justify-center items-center relative py-10 px-5 sm:px-8 md:px-10 overflow-y-auto min-h-screen"
                style={{ background: '#070B1A' }}
            >
                {/* Ambient glow behind auth card */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full pointer-events-none animate-float-slow"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(124,107,255,0.04) 0%, transparent 60%)',
                        filter: 'blur(60px)',
                    }}
                />

                {/* ─── Mobile Logo (visible only on mobile/tablet) ─── */}
                <div className="lg:hidden flex items-center justify-between w-full max-w-[520px] mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105"
                            style={{
                                background:
                                    'linear-gradient(135deg, #7C6BFF 0%, #2BCBFF 100%)',
                                boxShadow: '0 8px 24px rgba(124,107,255,0.3)',
                            }}
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-[-0.02em] leading-tight">
                                OpsMind AI
                            </h1>
                            <p
                                className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                                style={{ color: '#7C6BFF' }}
                            >
                                Enterprise Knowledge AI
                            </p>
                        </div>
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center gap-1 text-xs transition-colors"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Home
                    </Link>
                </div>

                {/* ─── AUTH CARD ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    className="w-full max-w-[520px] z-10 p-8 md:p-10"
                    style={{
                        background: 'rgba(10,15,35,0.75)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '32px',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.45)',
                    }}
                >
                    {/* ─── Card Header ─── */}
                    <div className="mb-8">
                        <h3
                            className="text-[28px] md:text-[32px] font-bold text-white tracking-[-0.02em] leading-tight mb-2"
                        >
                            Sign in to OpsMind AI
                        </h3>
                        <p
                            className="text-sm md:text-base"
                            style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                            Welcome back! Please sign in to continue
                        </p>
                    </div>

                    {/* ─── Clerk SignIn Component ─── */}
                    <SignIn
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        afterSignInUrl="/dashboard"
                        appearance={clerkAppearance}
                    />

                    {/* ─── Bottom Section ─── */}
                    <div className="mt-6 text-center">
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Don't have an account?{' '}
                            <Link
                                to="/sign-up"
                                className="font-medium transition-all duration-300 hover:underline"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(135deg, #7C6BFF 0%, #2BCBFF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* ─── Mobile: Back to homepage ─── */}
                <div className="lg:hidden mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs transition-colors"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}