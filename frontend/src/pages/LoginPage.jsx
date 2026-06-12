import { useState } from 'react';
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
    Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { useSignIn } from '@clerk/react';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
};

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
    if (isSignedIn) {
        navigate('/dashboard');
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
        <div className="min-h-screen bg-[#0a0f1a] flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-[#0a0f1a]" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-float-advanced" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center px-12 text-center">
                    <motion.div {...fadeInUp}>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-8 mx-auto">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Welcome to OpsMind
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 max-w-md">
                            Your AI-powered knowledge assistant. Upload documents, ask questions, and get instant answers with source citations.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-4 max-w-sm">
                            {[
                                { icon: '🧠', title: 'Intelligent RAG', desc: 'Context-aware answers from your documents' },
                                { icon: '📄', title: 'Document Processing', desc: 'Automatic chunking and embedding pipeline' },
                                { icon: '🔍', title: 'Source Citations', desc: 'Every answer linked to its source material' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.15 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{feature.title}</p>
                                        <p className="text-xs text-gray-400">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
                <motion.div
                    {...fadeInUp}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">OpsMind</span>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-8 shadow-2xl shadow-black/20">
                        <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                        <p className="text-gray-400 text-sm mb-6">Access your AI knowledge platform</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                      text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                      transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                      text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                      transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/[0.04] accent-violet-500" />
                                    Remember me
                                </label>
                                <button type="button" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600
                  text-white font-semibold text-sm shadow-lg shadow-violet-500/20
                  hover:shadow-xl hover:shadow-violet-500/30 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.06]" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 py-1 bg-[#0a0f1a] text-gray-500 rounded-full">or continue with</span>
                            </div>
                        </div>

                        {/* Social login */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]
                  text-gray-300 text-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                            >
                                <Chrome className="w-4 h-4" />
                                Google
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]
                  text-gray-300 text-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </motion.button>
                        </div>

                        {/* Sign up link */}
                        <p className="text-center text-sm text-gray-400 mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                                Create one <ArrowRight className="w-3 h-3 inline" />
                            </Link>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-4">
                        <Link to="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                            ← Back to homepage
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}