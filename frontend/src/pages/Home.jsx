import { Link } from 'react-router-dom'
import { Brain, Upload, FileText, Zap, Shield, TrendingUp, ArrowRight, Sparkles, Lock } from 'lucide-react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import Header from '../components/Header'

const Home = () => {
  const features = [
    // ... (existing features array)
  ]

  const stats = [
    // ... (existing stats array)
  ]

  const testimonials = [
    // ... (existing testimonials array)
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse">
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000">
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary-500/30 mb-8 animate-pulse">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Powered by Advanced AI Technology</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Documents Into
              <span className="block gradient-text mt-2">Intelligent Insights</span>
            </h1>
            <p className="text-xl sm:text-2xl text-dark-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Enterprise-grade AI platform that turns your documents into actionable intelligence.
              <span className="block mt-2 text-primary-300">Process, analyze, and extract value at scale.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignUpButton mode="modal">
                <button className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 transition-all animate-hover group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="btn-secondary text-lg px-10 py-5 inline-flex items-center justify-center gap-3">
                  <Lock className="w-5 h-5" />
                  Sign In
                </button>
              </SignInButton>
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-dark-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary-500/30 mb-6 animate-pulse">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Enterprise Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-dark-300 max-w-3xl mx-auto">Powerful features designed for modern enterprises who demand excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-effect p-8 rounded-2xl hover:scale-105 transition-all duration-300 border border-white/5 hover:border-primary-500/30 group animate-hover">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary-500/30 mb-6 animate-pulse">
              <Users className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">Trusted by Industry Leaders</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-effect p-8 rounded-2xl border border-white/5 animate-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-hover" />
                  ))}
                </div>
                <p className="text-dark-200 mb-6 leading-relaxed">{testimonial.content}</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-dark-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-effect rounded-3xl p-12 lg:p-16 text-center border border-primary-500/20 shadow-2xl shadow-primary-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-blue-500/10"></div>
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Transform Your Workflow?</h2>
              <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">Join thousands of organizations already using OpsMind AI to unlock the power of their documents</p>
              <SignUpButton mode="modal">
                <button className="btn-primary text-lg px-12 py-6 inline-flex items-center gap-3 shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all animate-hover group">
                  Start Your Free Trial
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
              <p className="text-sm text-dark-400 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-400" />
                <span className="text-xs text-primary-400">Enterprise</span>
              </div>
            </div>
            <p className="text-dark-400 text-sm">© 2026 OpsMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
