import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    Sparkles,
    Mail,
    Lock,
    User,
    ArrowRight,
    Eye,
    EyeOff,
    Chrome,
    Github,
    Loader2,
    CheckCircle2,
    Building2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const { isSignedIn, signUp } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        organization: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // If already signed in, redirect to dashboard
    if (isSignedIn) {
        navigate('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!agreedToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            if (signUp) {
                await signUp({
                    emailAddress: formData.email,
                    password: formData.password,
                    firstName: formData.fullName.split(' ')[0],
                    lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
                });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = () => {
        const p = formData.password;
        if (!p) return { level: 0, label: '', color: '' };
        let score = 0;
        if (p.length >= 8) score++;
        if (p.length >= 12) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;

        const levels = [
            { level: 1, label: 'Weak', color: 'text-red-400 bg-red-500/20' },
            { level: 2, label: 'Fair', color: 'text-amber-400 bg-amber-500/20' },
            { level: 3, label: 'Good', color: 'text-blue-400 bg-blue-500/20' },
            { level: 4, label: 'Strong', color: 'text-emerald-400 bg-emerald-500/20' },
            { level: 5, label: 'Excellent', color: 'text-violet-400 bg-violet-500/20' },
        ];
        return levels[Math.min(score, 5)] || levels[0];
    };

    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-[#0a0f1a] flex">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-[#0a0f1a]" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float-advanced" />

                <div className="relative z-10 flex flex-col items-center justify-center px-12 text-center">
                    <motion.div {...fadeInUp}>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8 mx-auto">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Join OpsMind
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 max-w-md">
                            Transform how your team interacts with knowledge. Get started in minutes.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-3 max-w-sm">
                            {[
                                'Free 14-day trial, no credit card required',
                                'Upload unlimited documents',
                                'AI-powered answers with citations',
                                'Enterprise-grade security & encryption',
                            ].map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.12 }}
                                    className="flex items-center gap-3 p-2"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />
            </div>

            {/* Right side - Register form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
                <motion.div {...fadeInUp} className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">OpsMind</span>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-8 shadow-2xl shadow-black/20">
                        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400 text-sm mb-6">Start your free trial today</p>

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
                            {/* Full Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                      text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                      transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@company.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                      text-white placeholder-gray-500 text-sm
                      focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                      transition-all"
                                    />
                                </div>
                            </div>

                            {/* Organization */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-1.5 block">Organization <span className="text-gray-500">(optional)</span></label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        name="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        placeholder="Your company name"
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min. 8 characters"
                                        required
                                        minLength={8}
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
                                {/* Password strength indicator */}
                                {formData.password && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(strength.level / 5) * 100}%` }}
                                                className={`h-full rounded-full ${strength.color.split(' ')[1] || 'bg-gray-500/20'}`}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${strength.color.split(' ')[0] || 'text-gray-400'}`}>
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/[0.04] accent-violet-500"
                                />
                                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                    I agree to the{' '}
                                    <button type="button" className="text-violet-400 hover:text-violet-300 underline">Terms of Service</button>
                                    {' '}and{' '}
                                    <button type="button" className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</button>
                                </span>
                            </label>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading || !agreedToTerms}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
                  text-white font-semibold text-sm shadow-lg shadow-indigo-500/20
                  hover:shadow-xl hover:shadow-indigo-500/30 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Create Account <ArrowRight className="w-4 h-4" />
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
                                <span className="px-3 py-1 bg-[#0a0f1a] text-gray-500 rounded-full">or sign up with</span>
                            </div>
                        </div>

                        {/* Social signup */}
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

                        {/* Sign in link */}
                        <p className="text-center text-sm text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                                Sign in <ArrowRight className="w-3 h-3 inline" />
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