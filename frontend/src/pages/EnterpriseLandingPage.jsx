import { motion } from 'framer-motion';
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
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';

export default function EnterpriseLandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

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

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<3s', label: 'Response Time' },
    { value: '10M+', label: 'Queries Processed' },
    { value: '500+', label: 'Enterprise Clients' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">OpsMind AI</h1>
                <p className="text-xs text-gray-600">Enterprise Edition</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="btn btn-ghost"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn btn-primary"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Trusted by 500+ Enterprise Companies
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Company's Knowledge,
              <br />
              <span className="text-gradient">Instantly Accessible</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your SOPs, policies, and documents into an intelligent AI assistant.
              Get accurate answers in seconds with zero hallucinations.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-indigo-500/50"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="glass rounded-3xl p-8 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <MessageSquare className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Interactive Demo Coming Soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50">
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
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600">
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
                  className="glass rounded-2xl p-8 hover:shadow-xl transition-all hover-lift"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
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
                className={`glass rounded-2xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-indigo-600 shadow-2xl scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full btn ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Knowledge Management?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 500+ companies using OpsMind AI to empower their teams
            </p>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary text-lg px-8 py-4 shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gradient">OpsMind AI</span>
              </div>
              <p className="text-sm text-gray-600">
                Enterprise knowledge management powered by AI
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600">Security</a></li>
                <li><a href="#" className="hover:text-indigo-600">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600">About</a></li>
                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-600">Security</a></li>
                <li><a href="#" className="hover:text-indigo-600">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 OpsMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
