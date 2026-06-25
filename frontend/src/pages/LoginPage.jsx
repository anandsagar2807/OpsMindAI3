import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    Sparkles,
    Mail,
    Lock,
    ArrowRight,
    Eye,
    EyeOff,
    Chrome,
    Github,
    Loader2,
    Brain,
    FileSearch,
    Quote,
    Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { useSignIn } from '@clerk/react';

const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

const staggerItems = {
    animate: {
        transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
};

const features = [
    { icon: Brain, title: 'Intelligent RAG', desc: 'Context-aware answers from your documents', gradient: 'from-violet-500 to-purple-600' },
    { icon: FileSearch, title: 'Document Processing', desc: 'Automatic chunking and embedding pipeline', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Quote, title: 'Source Citations', desc: 'Every answer linked to its source material', gradient: 'from-amber-500 to-orange-600' },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already signed in, redirect to dashboard
    useEffect(() => {
        if (isSignedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isSignedIn, navigate]);

    if (isSignedIn) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (signIn) {
                const result = await signIn.create({
                    identifier: email,
                    password,
                });
                if (result.status === 'complete') {
                    navigate('/dashboard');
                } else {
                    // Additional verification steps may be needed
                    setError('Sign in requires additional verification. Please check your email.');
                }
            }
        } catch (err) {
            const message = err.errors?.[0]?.message || err.message || 'Sign in failed. Please check your credentials.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
            {/* Animated base gradient */}
            <div className="fixed inset-0 opacity-30">
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[128px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-indigo-600/8 to-[#0a0a0f]" />
                <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[100px]" style={{ animation: 'float 12s ease-in-out infinite alternate' }} />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-16 text-center w-full">
                    <motion.div {...fadeInUp} className="w-full max-w-lg">
                        {/* Brand icon */}
                        <div className="relative inline-flex mb-10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 ring-1 ring-white/[0.08]">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                                <Shield className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>

                        <h2 className="text-[40px] font-bold text-white leading-[1.1] tracking-[-0.03em] mb-4">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">OpsMind</span>
                        </h2>
                        <p className="text-[16px] text-gray-400/80 mb-10 leading-relaxed max-w-md mx-auto">
                            Your AI-powered knowledge assistant. Upload documents, ask questions, and get instant answers with source citations.
                        </p>

                        {/* Feature highlights */}
                        <motion.div variants={staggerItems} initial="initial" animate="animate" className="space-y-3 max-w-sm mx-auto">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300 cursor-default"
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                                        <feature.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[14px] font-semibold text-white/90">{feature.title}</p>
                                        <p className="text-[12px] text-gray-500/80">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="lg:hidden flex items-center justify-center gap-3 mb-10"
                    >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25 ring-1 ring-white/[0.08]">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[24px] font-bold text-white tracking-[-0.02em]">OpsMind</span>
                    </motion.div>

                    {/* Form card */}
                    <div className="relative">
                        {/* Ambient glow behind card */}
                        <div className="absolute -inset-4 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-3xl opacity-50" />

                        <div className="relative rounded-2xl backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] p-8 shadow-2xl shadow-black/30">
                            {/* Subtle inner shine */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                            <div className="relative z-10">
                                <h2 className="text-[22px] font-bold text-white tracking-[-0.02em] mb-1">Welcome back</h2>
                                <p className="text-gray-400/80 text-[14px] mb-7">Sign in to your account</p>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -8, height: 0 }}
                                        className="mb-5 p-3 rounded-xl bg-rose-500/8 border border-rose-500/15 text-rose-400 text-[13px] flex items-center gap-2"
                                    >
                                        <div className="w-5 h-5 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-[11px] font-bold">!</span>
                                        </div>
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4.5">
                                    {/* Email */}
                                    <div>
                                        <label className="text-[13px] font-medium text-gray-300/90 mb-1.5 block">Email address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@company.com"
                                                required
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                                                    text-white placeholder-gray-500 text-[14px]
                                                    focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                                                    transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="text-[13px] font-medium text-gray-300/90 mb-1.5 block">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                required
                                                className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                                                    text-white placeholder-gray-500 text-[14px]
                                                    focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                                                    transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember me & Forgot */}
                                    <div className="flex items-center justify-between pt-0.5">
                                        <label className="flex items-center gap-2 text-[13px] text-gray-400 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-600 bg-white/[0.04] accent-violet-500 
                                                    checked:bg-violet-500 focus:ring-violet-500/20 focus:ring-offset-0"
                                            />
                                            <span className="group-hover:text-gray-300 transition-colors duration-200">Remember me</span>
                                        </label>
                                        <button type="button" className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors duration-200 font-medium">
                                            Forgot password?
                                        </button>
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="relative overflow-hidden w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600
                                            text-white font-semibold text-[14px] shadow-lg shadow-violet-500/20
                                            hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-400 hover:to-indigo-500
                                            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                                            flex items-center justify-center gap-2"
                                    >
                                        {/* Button shine */}
                                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent" />
                                        </div>
                                        <span className="relative z-10">
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Sign In <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/[0.06]" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-4 py-1 bg-[#0a0a0f] text-gray-500 rounded-full border border-white/[0.04]">
                                            or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social login */}
                                <div className="grid grid-cols-2 gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative overflow-hidden flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]
                                            text-gray-300 text-[13px] hover:bg-white/[0.08] hover:border-white/[0.14] hover:text-white transition-all duration-200 group"
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent" />
                                        </div>
                                        <Chrome className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Google</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative overflow-hidden flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]
                                            text-gray-300 text-[13px] hover:bg-white/[0.08] hover:border-white/[0.14] hover:text-white transition-all duration-200 group"
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent" />
                                        </div>
                                        <Github className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">GitHub</span>
                                    </motion.button>
                                </div>

                                {/* Sign up link */}
                                <p className="text-center text-[13px] text-gray-400 mt-6">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200 group">
                                        Create one{' '}
                                        <ArrowRight className="w-3 h-3 inline group-hover:translate-x-0.5 transition-transform duration-200" />
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Back to home */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-5"
                    >
                        <Link to="/" className="text-[12px] text-gray-600 hover:text-gray-400 transition-colors duration-200 group">
                            <span className="group-hover:-translate-x-0.5 inline-block transition-transform duration-200">←</span>{' '}
                            Back to homepage
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
