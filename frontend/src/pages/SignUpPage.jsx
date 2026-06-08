import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SignUp } from '@clerk/react';
import { Sparkles, ArrowLeft, CheckCircle2, AlertTriangle, RefreshCw, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { DEV_MODE } from '../lib/devAuth';

export default function SignUpPage() {
    const { isSignedIn, isLoaded, signUp } = useAuth();
    const navigate = useNavigate();
    const [clerkError, setClerkError] = useState(false);

    // Dev mode form state
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If Clerk doesn't load within 10 seconds, show an error (production mode only)
    useEffect(() => {
        if (!DEV_MODE && !isLoaded) {
            const timer = setTimeout(() => setClerkError(true), 10000);
            return () => clearTimeout(timer);
        } else {
            setClerkError(false);
        }
    }, [isLoaded]);

    // Dev mode form submission
    const handleDevSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (signUp) await signUp();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // If already signed in, redirect to dashboard
    if (isSignedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    // In production mode, wait for Clerk to load
    if (!DEV_MODE && !isLoaded) {
        if (clerkError) {
            return (
                <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-7 h-7 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-[#F8FAFC]">Authentication Service Unavailable</h2>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Unable to connect to the Clerk authentication service. This may be due to an invalid or expired publishable key in your configuration.
                        </p>
                        <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-4 text-xs text-[#94A3B8] w-full">
                            <p className="font-semibold text-[#F8FAFC] mb-2">How to fix:</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Check your <code className="text-[#6366F1]">frontend/.env</code> file</li>
                                <li>Verify <code className="text-[#6366F1]">VITE_CLERK_PUBLISHABLE_KEY</code> is valid</li>
                                <li>Get a new key from <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-[#6366F1] hover:text-[#8B5CF6] underline">Clerk Dashboard</a></li>
                                <li>Restart the dev server after updating the key</li>
                            </ol>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setClerkError(false); window.location.reload(); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-sm font-medium hover:from-[#4F46E5] hover:to-[#7C3AED] transition-all duration-300"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry
                            </button>
                            <Link
                                to="/"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] text-[#94A3B8] text-sm font-medium hover:text-[#F8FAFC] hover:border-white/[0.15] transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg animate-pulse">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[#94A3B8] text-sm">Loading authentication...</p>
                </div>
            </div>
        );
    }

    // ─── Shared Left Side (Branding) ───
    const leftSide = (
        <div className="w-full md:w-[40%] lg:w-[45%] flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#1E1B4B] border-b md:border-b-0 md:border-r border-white/[0.08] shrink-0">
            {/* Animated gradient orbs */}
            <div className="absolute top-[-6rem] right-[-6rem] w-[24rem] h-[24rem] md:w-[30rem] md:h-[30rem] rounded-full bg-[#6366F1]/[0.08] blur-3xl animate-float" />
            <div className="absolute bottom-[-8rem] left-[-4rem] w-[20rem] h-[20rem] md:w-[26rem] md:h-[26rem] rounded-full bg-[#8B5CF6]/[0.06] blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15rem] h-[15rem] md:w-[18rem] md:h-[18rem] rounded-full bg-[#06B6D4]/[0.04] blur-3xl animate-pulse" />

            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }} />

            {/* Left Side Content */}
            <div className="relative z-10 flex flex-col h-full justify-between gap-8 md:gap-12">
                {/* Logo & Navigation */}
                <div className="flex items-center justify-between md:block">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#6366F1]/30 group-hover:shadow-xl group-hover:shadow-[#6366F1]/40 transition-all duration-300 group-hover:scale-105">
                            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#F8FAFC]" />
                        </div>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-[#F8FAFC] tracking-[-0.02em] leading-tight">OpsMind AI</h1>
                            <p className="text-[10px] md:text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider">Enterprise Knowledge AI</p>
                        </div>
                    </Link>

                    {/* Homepage link visible on mobile next to logo */}
                    <Link
                        to="/"
                        className="md:hidden flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#6366F1] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Home
                    </Link>
                </div>

                {/* Branding Intro */}
                <div className="my-auto md:my-0">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[#F8FAFC] mb-4 md:mb-6 leading-[1.2] tracking-[-0.03em]">
                            Transform your{' '}
                            <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
                                knowledge
                            </span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-[#94A3B8] max-w-md leading-relaxed mb-6 md:mb-8">
                            Join 500+ companies using OpsMind AI to empower their teams with instant, accurate answers from their documents.
                        </p>
                    </motion.div>

                    {/* Benefits list */}
                    <div className="hidden md:flex flex-col gap-3 max-w-md">
                        {[
                            'Free 14-day trial, no credit card required',
                            'Upload unlimited documents',
                            'AI-powered answers with source citations',
                            'Enterprise-grade security & encryption',
                            'Zero-hallucination guarantee',
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.08 }}
                                className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-200"
                            >
                                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 shrink-0" />
                                <span className="text-xs md:text-sm text-gray-300">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Back to home (Desktop/Tablet) */}
                <div className="hidden md:block">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#6366F1] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );

    // ─── Right Side: Dev Mode Custom Form or Clerk Form ───
    const rightSide = DEV_MODE ? (
        /* Dev Mode: Custom Signup Form */
        <div className="flex-1 flex flex-col justify-center items-center relative py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F172A] overflow-y-auto min-h-[500px]">
            {/* Ambient glow behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] md:w-[32rem] md:h-[32rem] rounded-full bg-[#8B5CF6]/[0.03] blur-3xl pointer-events-none" />

            {/* Dev mode banner */}
            <div className="w-full max-w-[440px] z-10 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dev Mode — Any credentials will work. Replace <code className="text-amber-200">VITE_CLERK_PUBLISHABLE_KEY</code> with a real key for production auth.</span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="w-full max-w-[440px] z-10"
            >
                <div className="bg-[#111827] border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-2xl w-full p-6 md:p-8">
                    <h2 className="text-[#F8FAFC] text-2xl font-bold tracking-tight text-center mb-1">Create your account</h2>
                    <p className="text-[#94A3B8] text-sm font-normal mt-1 text-center mb-6">Start your free trial today</p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleDevSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="text-[#F8FAFC] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/40" />
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/[0.08] text-[#F8FAFC] placeholder-[#94A3B8]/40 focus:border-[#6366F1]/80 focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-300 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[#F8FAFC] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/40" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="you@company.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/[0.08] text-[#F8FAFC] placeholder-[#94A3B8]/40 focus:border-[#6366F1]/80 focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-300 text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-[#F8FAFC] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#0F172A] border border-white/[0.08] text-[#F8FAFC] placeholder-[#94A3B8]/40 focus:border-[#6366F1]/80 focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-300 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 tracking-wide border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="bg-transparent border-t border-white/[0.04] mt-4 pt-4 text-center">
                        <p className="text-[#94A3B8] text-sm">
                            Already have an account?{' '}
                            <Link to="/sign-in" className="text-[#6366F1] hover:text-[#8B5CF6] font-medium text-sm transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    ) : (
        /* Production Mode: Clerk SignUp Form */
        <div className="flex-1 flex flex-col justify-center items-center relative py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-[#0F172A] overflow-y-auto min-h-[500px]">
            {/* Ambient glow behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] md:w-[32rem] md:h-[32rem] rounded-full bg-[#8B5CF6]/[0.03] blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="w-full max-w-[440px] z-10"
            >
                <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    afterSignUpUrl="/dashboard"
                    appearance={{
                        variables: {
                            colorPrimary: '#6366F1',
                            colorBackground: '#111827',
                            colorText: '#F8FAFC',
                            colorTextSecondary: '#94A3B8',
                            colorInputBackground: '#0F172A',
                            colorInputText: '#F8FAFC',
                            colorBorderPrimary: 'rgba(255,255,255,0.08)',
                            borderRadius: '0.75rem',
                            colorSuccess: '#06B6D4',
                        },
                        elements: {
                            rootBox: 'w-full',
                            card: 'bg-[#111827] border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-2xl w-full p-6 md:p-8',
                            headerLogo: 'hidden',
                            headerTitle: 'text-[#F8FAFC] text-2xl font-bold tracking-tight text-center',
                            headerSubtitle: 'text-[#94A3B8] text-sm font-normal mt-1 text-center',
                            socialButtonsBlockButton: 'rounded-xl border border-white/[0.08] bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1E293B] hover:border-white/[0.15] transition-all duration-300 py-2.5',
                            socialButtonsBlockButtonText: 'text-sm font-medium text-[#F8FAFC]',
                            socialButtonsBlockButtonArrow: 'text-[#94A3B8]',
                            dividerRow: 'my-5',
                            dividerText: 'text-[#94A3B8] text-xs uppercase tracking-wider font-semibold',
                            dividerLine: 'bg-white/[0.08]',
                            formButtonPrimary: 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 w-full py-2.5 tracking-wide border-0',
                            formFieldLabel: 'text-[#F8FAFC] text-xs font-semibold uppercase tracking-wider mb-1.5',
                            formFieldInput: 'rounded-xl bg-[#0F172A] border border-white/[0.08] text-[#F8FAFC] placeholder-[#94A3B8]/40 focus:border-[#6366F1]/80 focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-300 py-2.5 px-4 text-sm',
                            formFieldInputShowPasswordButton: 'text-[#94A3B8] hover:text-[#F8FAFC]',
                            formFieldAction: 'text-[#6366F1] hover:text-[#8B5CF6] text-sm font-medium transition-colors',
                            footer: 'bg-transparent border-t border-white/[0.04] mt-4 pt-4',
                            footerActionText: 'text-[#94A3B8] text-sm',
                            footerActionLink: 'text-[#6366F1] hover:text-[#8B5CF6] font-medium text-sm transition-colors',
                            identityPreviewText: 'text-[#F8FAFC]',
                            identityPreviewEditButton: 'text-[#6366F1] hover:text-[#8B5CF6]',
                            alert: 'rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 text-sm',
                            alertText: 'text-sm text-red-200',
                            formFieldErrorText: 'text-red-400 text-xs mt-1',
                            otpCodeFieldInput: 'rounded-xl bg-[#0F172A] border border-white/[0.08] text-[#F8FAFC]',
                            form: 'gap-4',
                            formFieldRow: 'gap-1.5',
                            formFieldsWrapper: 'gap-4',
                        },
                    }}
                />
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col md:flex-row relative w-full overflow-x-hidden text-[#F8FAFC]">
            {leftSide}
            {rightSide}
        </div>
    );
}