import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  ArrowRight,
  Check,
  Star,
  Globe,
  Lock,
  BarChart3,
  Quote,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../hooks/useAuthContext';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import PremiumNotificationBar from '../components/PremiumNotificationBar.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export default function EnterpriseLandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState(null);
  const [publicStats, setPublicStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Health request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) setHealth(data);
      } catch (e) {
        if (!cancelled) setHealthError(e?.message || 'Failed to load health');
      }
    };

    const loadStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/stats`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Stats request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled && data.success) setPublicStats(data.data);
      } catch (e) {
        console.error('Failed to load public stats:', e);
      }
    };

    loadHealth();
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleContactSales = () => {
    window.location.href = 'mailto:sales@opsmind.ai?subject=Enterprise Inquiry';
  };

  const handleWatchDemo = () => {
    // Open demo video or demo page
    window.open('https://www.youtube.com/watch?v=ILRl6Xir0J0', '_blank');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Search',
      description: 'Find information instantly with advanced RAG technology and semantic search'
    },
    {
      icon: Shield,
      title: 'Zero Hallucinations',
      description: 'Strict context-only responses ensure accurate, trustworthy answers every time'
    },
    {
      icon: Zap,
      title: 'Real-Time Streaming',
      description: 'ChatGPT-quality responses with lightning-fast streaming and source citations'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Role-based access control, data isolation, and SOC 2 compliant infrastructure'
    },
    {
      icon: FileText,
      title: 'Document Intelligence',
      description: 'Upload PDFs, SOPs, and manuals - AI understands and retrieves relevant sections'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track usage, monitor performance, and gain insights into team productivity'
    }
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Perfect for small teams',
      features: [
        'Up to 10 users',
        '100 documents',
        '1,000 queries/month',
        'Email support',
        'Basic analytics'
      ]
    },
    {
      name: 'Professional',
      price: '$199',
      period: '/month',
      description: 'For growing organizations',
      features: [
        'Up to 50 users',
        'Unlimited documents',
        '10,000 queries/month',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'SSO authentication'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large enterprises',
      features: [
        'Unlimited users',
        'Unlimited documents',
        'Unlimited queries',
        '24/7 dedicated support',
        'Custom deployment',
        'SLA guarantee',
        'White-label option',
        'On-premise available'
      ]
    }
  ];

  const formatStat = (num) => {
    if (!num && num !== 0) return '...';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  const stats = [
    { value: publicStats?.uptime || '99.9%', label: 'Uptime' },
    { value: publicStats?.avgResponseTime || '< 3s', label: 'Response Time' },
    { value: publicStats ? formatStat(publicStats.totalQueries) : '...', label: 'Queries Processed' },
    { value: publicStats ? formatStat(publicStats.totalUsers) : '...', label: 'Active Users' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO, TechCorp',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
      content: 'OpsMind AI reduced our support ticket resolution time by 70%. Game-changer for our operations team.'
    },
    {
      name: 'Michael Chen',
      role: 'VP Operations, FinanceHub',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff',
      content: 'The zero-hallucination guarantee gives us confidence. Our compliance team loves the source citations.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of HR, GlobalCo',
      image: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=06b6d4&color=fff',
      content: 'Onboarding new employees is 10x faster. They get instant answers to policy questions 24/7.'
    }
  ];

  const integrations = [
    { name: 'Slack', logo: '💬', url: 'https://slack.com' },
    { name: 'Microsoft Teams', logo: '👥', url: 'https://teams.microsoft.com' },
    { name: 'Google Drive', logo: '📁', url: 'https://drive.google.com' },
    { name: 'Dropbox', logo: '📦', url: 'https://dropbox.com' },
    { name: 'Salesforce', logo: '☁️', url: 'https://salesforce.com' },
    { name: 'Zendesk', logo: '🎫', url: 'https://zendesk.com' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800">
      {/* Premium Notification Bar — dynamic, sits ABOVE the header */}
      <PremiumNotificationBar
        isSignedIn={isSignedIn}
        user={user}
        health={health}
        healthError={healthError}
        publicStats={publicStats}
        onSignUp={() => navigate('/sign-up')}
      />

      {/* Navigation */}
      <nav className="bg-dark-900/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-white">OpsMind AI</h1>
                  <p className="mt-0.5 text-xs font-semibold text-white/80">
                    Enterprise Edition
                  </p>
                </div>
                <div className="hidden sm:flex items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/20">
                    Enterprise
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                className="text-gray-200/90 hover:text-white transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}
                className="text-gray-200/90 hover:text-white transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
                className="text-gray-200/90 hover:text-white transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#integrations"
                onClick={(e) => { e.preventDefault(); scrollToSection('integrations'); }}
                className="text-gray-200/90 hover:text-white transition-colors font-medium"
              >
                Integrations
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* Sign In button (secondary outline style) */}
              <button
                onClick={() => navigate('/sign-in')}
                className="relative group px-5 py-2.5 text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 ease-out rounded-lg border border-white/[0.10] hover:border-white/[0.18] bg-white/[0.03] hover:bg-white/[0.06]"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/8 via-violet-400/4 to-purple-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Sign Up button (premium gradient CTA) */}
              <button
                onClick={() => navigate('/sign-up')}
                className="relative group px-6 py-2.5 text-sm font-semibold text-white overflow-hidden transition-all duration-300 ease-out rounded-lg shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] hover:-translate-y-[1px] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-[length:200%_100%] animate-gradient-x" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 z-10">
                  Sign Up
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 rounded-lg border border-indigo-400/20 group-hover:border-indigo-400/40 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-purple-950/40">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto animate-fade-in-up"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 text-primary-400" />
              {health?.success
                ? `Platform Online • Updated ${new Date(health.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : `Platform Status • ${healthError ? 'Offline' : 'Loading...'}`}
            </div>

            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Your Company's Knowledge,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Instantly Accessible</span>
            </h1>

            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Transform your SOPs, policies, and documents into an intelligent AI assistant.
              Get accurate answers in seconds with zero hallucinations.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={() => navigate('/sign-up')}
                variant="primary"
                className="btn-premium text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
              <button
                onClick={handleWatchDemo}
                className="btn btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>


            <p className="text-sm text-gray-300 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>

            {/* Chat Agent Embed - Locked behind sign-up overlay for unauthenticated users */}
            <div className="mt-8 w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg relative">
              <iframe
                src="https://app.relevanceai.com/agents/f1db6c/0b7a4882-502d-43b3-a4c7-a188ae52e4ca/9671bbca-9c52-422d-8dd5-e2a7618eff4a/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false"
                title="OpsMind AI Chat Agent"
                style={{ width: '100%', height: '600px', border: 'none', background: '#ffffff' }}
                allow="clipboard-write"
              />

              {/* Lock overlay for unauthenticated users — uses real Clerk auth */}
              {!isSignedIn && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center rounded-2xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.60) 0%, rgba(15, 23, 42, 0.90) 100%)',
                    backdropFilter: 'blur(14px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30 mb-5">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    Big Bro Sales Copilot is locked
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-[320px]">
                    Sign up for a free OpsMind AI account to unlock the sales copilot and start
                    getting instant, citation-backed answers from your documents.
                  </p>
                  <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                    <button
                      onClick={() => navigate('/sign-up')}
                      className="group flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Star className="w-4 h-4" />
                      <span>Sign up — it's free</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    <button
                      onClick={() => navigate('/sign-in')}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] hover:border-white/[0.20] text-white/90 hover:text-white font-medium text-sm transition-all duration-200"
                    >
                      <span>Already have an account? Sign in</span>
                    </button>
                  </div>
                  <p className="mt-5 text-[11px] text-white/40 uppercase tracking-[0.15em] font-semibold">
                    14-day free trial · No credit card
                  </p>
                </div>
              )}
            </div>

          </motion.div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-transparent border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-gray-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-100">
              Everything you need to transform your company knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="card-premium hover:scale-105"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-100 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-100">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="card-premium"
              >
                <Quote className="w-10 h-10 text-indigo-600 mb-4" />
                <p className="text-gray-100 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-100">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Integrates with Your Favorite Tools
            </h2>
            <p className="text-xl text-gray-100">
              Connect OpsMind AI with the tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                onClick={() => window.open(integration.url, '_blank')}
                className="card-premium hover:scale-105 cursor-pointer"
              >
                <div className="text-4xl">{integration.logo}</div>
                <p className="text-sm font-medium text-gray-300 text-center">{integration.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-br from-[#0d1525] to-[#0a0f1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl p-8 relative border-2 ${plan.popular ? 'border-violet-500/50 shadow-2xl shadow-violet-500/20 scale-105' : 'border-white/[0.08]'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === 'Enterprise' ? (
                  <button
                    onClick={handleContactSales}
                    className="w-full btn btn-secondary"
                  >
                    Contact Sales
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/sign-up')}
                    className={`w-full btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Start Free Trial
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Knowledge Management?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join 500+ companies using OpsMind AI to empower their teams
            </p>
            <button
              onClick={() => navigate('/sign-up')}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all inline-flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-transparent border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">OpsMind AI</span>
              </div>
              <p className="text-sm text-gray-100">
                Enterprise knowledge management powered by AI
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-indigo-600 cursor-pointer">Features</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }} className="hover:text-indigo-600 cursor-pointer">Pricing</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Security documentation coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Security</a></li>
                <li><a href="#integrations" onClick={(e) => { e.preventDefault(); scrollToSection('integrations'); }} className="hover:text-indigo-600 cursor-pointer">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('About page coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">About</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Blog coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Blog</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Careers page coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Careers</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleContactSales(); }} className="hover:text-indigo-600 cursor-pointer">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Privacy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Terms</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Security documentation coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Security</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Compliance documentation coming soon!'); }} className="hover:text-indigo-600 cursor-pointer">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 OpsMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
