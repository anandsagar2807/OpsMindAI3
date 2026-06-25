import { useState, useEffect } from 'react';
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
    Building2,
    Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';
import { useSignUp } from '@clerk/react';

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

const benefits = [
    'Free 14-day trial, no credit card required',
    'Upload unlimited documents',
    'AI-powered answers with citations',
    'Enterprise-grade security & encryption',
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { isLoaded, signUp } = useSignUp();
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
    useEffect(() => {
        if (isSignedIn) {
            navigate('/dashboard', { replace: true });
        }
    }, [isSignedIn, navigate]);

    if (isSignedIn) {
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
                const result = await signUp.create({
                    emailAddress: formData.email,
                    password: formData.password,
                    firstName: formData.fullName.split(' ')[0],
                    lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
                });
                if (result.status === 'complete') {
                    navigate('/dashboard');
                } else {
                    // Additional verification steps may be needed (e.g. email verification)
                    setError('Registration requires additional verification. Please check your email to complete sign-up.');
                }
            }
        } catch (err) {
            const message = err.errors?.[0]?.message || err.message || 'Registration failed. Please try again.';
            setError(message);
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
            { level: 1, label: 'Weak', color: 'text-rose-400 bg-rose-500/20' },
            { level: 2, label: 'Fair', color: 'text-amber-400 bg-amber-500/20' },
            { level: 3, label: 'Good', color: 'text-blue-400 bg-blue-500/20' },
            { level: 4, label: 'Strong', color: 'text-emerald-400 bg-emerald-500/20' },
            { level: 5, label: 'Excellent', color: 'text-violet-400 bg-violet-500/20' },
        ];
        return levels[Math.min(score, 5)] || levels[0];
    };

    const strength = passwordStrength();

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
            {/* Animated base gradient */}
            <div className="fixed inset-0 opacity-30">
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[128px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[128px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-violet-600/8 to-[#0a0a0f]" />
                <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px]" style={{ animation: 'float 12s ease-in-out infinite alternate' }} />

                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />

                <div className="relative z-10 flex flex-col items-center justify-center px-16 text-center w-full">
                    <motion.div {...fadeInUp} className="w-full max-w-lg">
                        <div className="relative inline-flex mb-10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 ring-1 ring-white/[0.08]">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                                <Shield className="w-4 h-4 text-emerald-400" />
                            </div>
                        </div>

                        <h2 className="text-[40px] font-bold text-white leading-[1.1] tracking-[-0.03em] mb-4">
                            Join{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">OpsMind</span>
                        </h2>
                        <p className="text-[16px] text-gray-400/80 mb-10 leading-relaxed max-w-md mx-auto">
                            Transform how your team interacts with knowledge. Get started in minutes.
                        </p>

                        {/* Benefits */}
                        <motion.div variants={staggerItems} initial="initial" animate="animate" className="space-y-3 max-w-sm mx-auto">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all duration-300"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/[0.12] flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-[14px] text-gray-300/80 text-left">{benefit}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right side - Register form */}
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
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-1 ring-white/[0.08]">
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
                                <h2 className="text-[22px] font-bold text-white tracking-[-0.02em] mb-1">Create Account</h2>
                                <p className="text-gray-400/80 text-[14px] mb-7">Start your free trial today</p>

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
                                    {/* Full Name */}
                                    <div>
                                        <label className="text-[13px] font-medium text-gray-300/90 mb-1.5 block">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                                                    text-white placeholder-gray-500 text-[14px]
                                                    focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                                                    transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-[13px] font-medium text-gray-300/90 mb-1.5 block">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@company.com"
                                                required
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]
                                                    text-white placeholder-gray-500 text-[14px]
                                                    focus:outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20
                                                    transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Organization */}
                                    <div>
                                        <label className="text-[13px] font-medium text-gray-300/90 mb-1.5 block">Organization <span className="text-gray-500">(optional)</span></label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-violet-400 transition-colors duration-200" />
                                            <input
                                                type="text"
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleChange}
                                                placeholder="Your company name"
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
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Min. 8 characters"
                                                required
                                                minLength={8}
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
                                                <span className={`text-[11px] font-medium ${strength.color.split(' ')[0] || 'text-gray-400'}`}>
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
                                            className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-white/[0.04] accent-violet-500 
                                                checked:bg-violet-500 focus:ring-violet-500/20 focus:ring-offset-0"
                                        />
                                        <span className="text-[12px] text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
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
                                        className="relative overflow-hidden w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
                                            text-white font-semibold text-[14px] shadow-lg shadow-indigo-500/20
                                            hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-400 hover:to-violet-500
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
                                                    Create Account <ArrowRight className="w-4 h-4" />
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
                                            or sign up with
                                        </span>
                                    </div>
                                </div>

                                {/* Social signup */}
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

                                {/* Sign in link */}
                                <p className="text-center text-[13px] text-gray-400 mt-6">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-200 group">
                                        Sign in{' '}
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
