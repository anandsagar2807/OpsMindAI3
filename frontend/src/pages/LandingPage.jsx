// Premium Landing Page with Clerk Authentication
import { motion } from 'framer-motion'
import { SignInButton, SignUpButton, useUser } from '@clerk/react'
import {
  Brain,
  Sparkles,
  Zap,
  Shield,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  BarChart3,
  MessageSquare,
  Lock,
  Globe,
  Clock
} from 'lucide-react'
import { Button, Card } from '../components/ui'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const { isSignedIn } = useUser()
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Answers',
      description: 'Get instant, accurate answers from your company knowledge base using advanced AI technology.'
    },
    {
      icon: FileText,
      title: 'Source Citations',
      description: 'Every answer includes direct citations to source documents for complete transparency.'
    },
    {
      icon: Shield,
      title: 'Secure Knowledge Base',
      description: 'Enterprise-grade security with encryption, access controls, and compliance certifications.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second response times powered by optimized vector search and caching.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Query and retrieve information in over 50 languages with native understanding.'
    },
    {
      icon: TrendingUp,
      title: 'Smart Learning',
      description: 'AI continuously learns from usage patterns to improve answer quality over time.'
    }
  ]

  const stats = [
    { value: '10M+', label: 'Documents Processed' },
    { value: '50K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<100ms', label: 'Avg Response Time' }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechCorp',
      avatar: 'SC',
      content: 'OpsMind AI transformed how our team accesses information. What used to take hours now takes seconds.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Operations Director, GlobalCo',
      avatar: 'MR',
      content: 'The ROI was immediate. Our support team resolution time dropped by 70% in the first month.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Head of Knowledge, DataFlow',
      avatar: 'EW',
      content: 'Finally, a solution that actually understands context. The AI accuracy is remarkable.',
      rating: 5
    }
  ]

  const pricing = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out OpsMind AI',
      features: [
        '10 documents',
        '100 queries/month',
        'Basic AI model',
        'Email support',
        '7-day history'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: 'per user/month',
      description: 'For growing teams and businesses',
      features: [
        'Unlimited documents',
        'Unlimited queries',
        'Advanced AI model',
        'Priority support',
        'Unlimited history',
        'Custom integrations',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact sales',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated infrastructure',
        'SSO & SAML',
        'Custom AI training',
        'SLA guarantee',
        'Dedicated support',
        'On-premise option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">OpsMind AI</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-400" />
                  <span className="text-xs text-primary-400 font-medium">Enterprise</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <SignInButton
                    mode="modal"
                    redirectUrl="/dashboard"
                    fallbackRedirectUrl="/dashboard"
                  >
                    <button className="text-dark-300 hover:text-white transition px-6 py-2 font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton
                    mode="modal"
                    redirectUrl="/dashboard"
                    fallbackRedirectUrl="/dashboard"
                  >
                    <Button>Get Started Free</Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Powered by Advanced AI Technology</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Company's Brain,
              <span className="block bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent mt-2">
                Powered by AI
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-dark-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ask anything. Get instant answers from your SOPs.
              <span className="block mt-2 text-primary-300">Transform documents into intelligent conversations.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" icon={ArrowRight}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal" redirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                  <Button size="lg" icon={ArrowRight}>
                    Get Started Free
                  </Button>
                </SignUpButton>
              )}
              <Button size="lg" variant="secondary">
                Book Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-dark-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Chat Preview */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card glass className="p-8">
              <div className="space-y-6">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-md bg-primary-500/20 border border-primary-500/30 rounded-2xl px-6 py-4">
                    <p className="text-white">What's our refund policy for enterprise customers?</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="max-w-2xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-primary-300">OpsMind AI</span>
                    </div>
                    <p className="text-white leading-relaxed mb-4">
                      For enterprise customers, we offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, you'll receive a full refund, no questions asked.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                      <FileText className="w-3 h-3" />
                      <span>Source: Enterprise_Policy_2024.pdf, Page 12</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary-500/30 mb-6">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Enterprise Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-dark-300 max-w-3xl mx-auto">
              Powerful features designed for modern enterprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover glass>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-dark-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary-500/30 mb-6">
              <Users className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Trusted by Industry Leaders</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card glass>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-dark-400">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-primary-500/30 mb-6">
              <BarChart3 className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Simple, Transparent Pricing</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-dark-300 max-w-3xl mx-auto">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card glass className={`relative ${plan.popular ? 'border-primary-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period !== 'contact sales' && (
                        <span className="text-dark-400 ml-2">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-dark-400 text-sm">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-dark-300">
                        <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isSignedIn ? (
                    <Link to="/dashboard">
                      <Button
                        variant={plan.popular ? 'primary' : 'secondary'}
                        className="w-full"
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Go to Dashboard'}
                      </Button>
                    </Link>
                  ) : (
                    <SignUpButton mode="modal" redirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                      <Button
                        variant={plan.popular ? 'primary' : 'secondary'}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </SignUpButton>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card glass className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-500/10"></div>
            <div className="relative text-center p-12 lg:p-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">
                Join thousands of organizations using OpsMind AI to unlock the power of their knowledge
              </p>
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" icon={ArrowRight}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal" redirectUrl="/dashboard">
                  <Button size="lg" icon={ArrowRight}>
                    Start Your Free Trial
                  </Button>
                </SignUpButton>
              )}
              <p className="text-sm text-dark-400 mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">OpsMind AI</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-400" />
                  <span className="text-xs text-primary-400">Enterprise</span>
                </div>
              </div>
            </div>
            <p className="text-dark-400 text-sm">
              © 2026 OpsMind AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
