import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, ChevronRight, Zap, Menu, X, User, LogOut, Brain } from 'lucide-react'
import { useAuth, useUser } from '../hooks/useAuthContext'
import LogoNeuralMind from './Logo'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'

  const { isSignedIn } = useAuth()
  const { user } = useUser()

  const userName = user?.fullName || user?.username || 'User'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navLinkClass = (path) => `
    relative group font-medium tracking-wide transition-all duration-300 ease-out text-[15px]
    ${location.pathname === path
      ? 'text-blue-300'
      : 'text-neutral-300 hover:text-white'
    }
  `

  const navItems = [
    { path: '/features', label: 'Features', icon: Zap },
    { path: '/pricing', label: 'Pricing', icon: Sparkles },
    { path: '/about', label: 'About', icon: Brain }
  ]

  return (
    <>
      {/* Premium Grain Overlay for Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-[9999] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      {/* Top accent line - always visible, intensifies on scroll */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div className={`
          h-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent
          transition-all duration-700 ease-out
          ${isScrolled ? 'via-blue-500/70 scale-x-100' : 'via-blue-500/20 scale-x-75'}
        `} />
        {/* Secondary glow line */}
        <div className={`
          absolute top-0 left-0 right-0 h-[1px]
          bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[1px]
          transition-all duration-700 ease-out
          ${isScrolled ? 'opacity-100' : 'opacity-40'}
        `} />
      </div>

      <header
        className={`
          fixed top-0 left-0 right-0 z-50 isolate transition-all duration-500 ease-out
          ${isScrolled
            ? 'bg-[rgba(6,10,18,0.88)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)] shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-3'
            : 'bg-transparent border-b border-transparent py-5'
          }
        `}
      >
        {/* Subtle animated grid pattern on scroll */}
        <div className={`
          absolute inset-0 pointer-events-none transition-opacity duration-700
          ${isScrolled ? 'opacity-[0.03]' : 'opacity-0'}
        `} style={{
            backgroundImage: `radial-gradient(circle, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center">
            {/* ========== Premium Logo Section ========== */}
            <div className="flex items-center gap-4">
              <Link to="/" className="relative group">
                {/* Outer glow ring */}
                <div className={`
                  absolute -inset-3 rounded-2xl transition-all duration-700
                  ${isScrolled
                    ? 'bg-blue-500/[0.04] blur-2xl'
                    : 'bg-blue-500/[0.02] blur-xl group-hover:bg-blue-500/[0.06]'
                  }
                `} />

                {/* Pulsing ring animation */}
                <div className="absolute -inset-2 rounded-2xl">
                  <div className="absolute inset-0 rounded-2xl border border-blue-400/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Main logo container */}
                <div className="relative group-hover:scale-[1.04] transition-transform duration-500">
                  <LogoNeuralMind size={52} />
                </div>

                {/* Hover border ring */}
                <div className="absolute -inset-[3px] rounded-[18px] border border-blue-500/0 group-hover:border-blue-500/25 transition-all duration-500 pointer-events-none" />
              </Link>

              {/* Brand name with premium typography */}
              <div className="flex flex-col">
                <Link to="/" className="group relative">
                  <h1 className="text-[26px] font-extrabold tracking-[-0.02em] leading-none">
                    {isHomePage ? (
                      <span className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-all duration-500">
                        OpsMind AI
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%_100%] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_22px_rgba(59,130,246,0.8)] transition-all duration-500 animate-gradient-x">
                        OpsMind AI
                      </span>
                    )}
                  </h1>
                </Link>

                {/* Premium tagline */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300/80 font-semibold">
                    Enterprise Knowledge AI
                  </span>
                  {/* Pro badge */}
                  <span className="ml-1 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/20 text-blue-300">
                    Pro
                  </span>
                </div>
              </div>
            </div>

            {/* ========== Desktop Navigation ========== */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onMouseEnter={() => setIsHovered(item.path)}
                    onMouseLeave={() => setIsHovered(null)}
                    className={`
                      relative group px-4 py-2 rounded-lg transition-all duration-300 ease-out
                      ${isActive
                        ? 'bg-blue-500/[0.06]'
                        : 'hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={`
                        w-3.5 h-3.5 transition-all duration-300
                        ${isActive
                          ? 'text-blue-400'
                          : 'text-neutral-500 group-hover:text-blue-400/70'
                        }
                      `} />
                      <span className={navLinkClass(item.path)}>
                        {item.label}
                      </span>
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                    )}

                    {/* Hover gradient underline */}
                    <span
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
                      style={{
                        transform: (isHovered === item.path || isActive) ? 'scaleX(1)' : 'scaleX(0)',
                        opacity: (isHovered === item.path || isActive) ? 1 : 0
                      }}
                    />

                    {/* Hover glow */}
                    <span
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-400/40 blur-[2px] rounded-full transition-all duration-300"
                      style={{
                        transform: isHovered === item.path ? 'scaleX(1)' : 'scaleX(0)',
                        opacity: isHovered === item.path ? 1 : 0
                      }}
                    />
                  </Link>
                )
              })}
            </nav>

            {/* ========== Auth Buttons ========== */}
            <div className="flex items-center gap-3">
              {isHomePage ? (
                <>
                  {/* Sign In button (secondary outline style) */}
                  <button
                    onClick={() => navigate('/sign-in')}
                    className="
                      relative group px-5 py-2.5 text-sm font-medium
                      text-neutral-300 hover:text-white
                      transition-all duration-300 ease-out
                      rounded-lg border border-white/[0.08] hover:border-white/[0.15]
                      bg-white/[0.02] hover:bg-white/[0.05]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a12]
                    "
                  >
                    <span className="relative z-10">Sign In</span>
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/8 via-cyan-400/4 to-blue-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>

                  {/* Sign Up button (premium gradient CTA) */}
                  <button
                    onClick={() => navigate('/sign-up')}
                    className="
                      relative group px-6 py-2.5 text-sm font-semibold
                      text-white overflow-hidden
                      transition-all duration-300 ease-out
                      rounded-lg
                      shadow-[0_4px_20px_rgba(59,130,246,0.35)]
                      hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)]
                      hover:-translate-y-[1px] active:scale-[0.98]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a12]
                    "
                  >
                    {/* Animated gradient background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-[length:200%_100%] animate-gradient-x" />
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    {/* Top highlight */}
                    <span className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Content */}
                    <span className="relative flex items-center gap-2 z-10">
                      Sign Up
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {/* Border glow */}
                    <span className="absolute inset-0 rounded-lg border border-indigo-400/20 group-hover:border-indigo-400/40 transition-all duration-300" />
                  </button>
                </>
              ) : (
                <>
                  {/* Dashboard link */}
                  <Link
                    to="/dashboard"
                    className="
                      relative group px-5 py-2.5 text-sm font-medium
                      text-neutral-300 hover:text-white
                      transition-all duration-300 ease-out
                      hover:bg-[rgba(255,255,255,0.04)]
                      rounded-lg
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                    "
                  >
                    <span className="relative flex items-center gap-2">
                      Dashboard
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </span>
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/8 via-cyan-400/4 to-blue-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Dev user avatar + dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                      className="
                        relative w-[42px] h-[42px] rounded-xl overflow-hidden
                        ring-2 ring-white/[0.08] hover:ring-blue-500/40
                        transition-all duration-300
                        shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                        bg-gradient-to-br from-indigo-600 to-purple-700
                        flex items-center justify-center
                        text-white text-sm font-bold
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                      "
                    >
                      {userInitials}
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                      <div className="
                        absolute right-0 top-full mt-2 w-56
                        bg-[rgba(12,16,28,0.98)] backdrop-blur-2xl
                        border border-white/[0.08] rounded-xl
                        shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                        overflow-hidden z-50
                        animate-[fadeIn_150ms_ease-out]
                      ">
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-white truncate">{userName}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">admin@opsmind.dev</p>
                        </div>

                        <div className="py-1">
                          {/* Profile */}
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                            className="
                              w-full flex items-center gap-3 px-4 py-2.5 text-sm
                              text-neutral-300 hover:text-white hover:bg-white/[0.04]
                              transition-all duration-150
                            "
                          >
                            <User className="w-4 h-4 text-neutral-400" />
                            Profile & Settings
                          </button>

                          {/* Sign Out */}
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate('/'); }}
                            className="
                              w-full flex items-center gap-3 px-4 py-2.5 text-sm
                              text-neutral-300 hover:text-red-400 hover:bg-white/[0.04]
                              transition-all duration-150
                            "
                          >
                            <LogOut className="w-4 h-4 text-neutral-400" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden relative p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========== Mobile Navigation ========== */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-400 ease-out
          ${mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/[0.04] mt-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-blue-500/[0.08] text-blue-300'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom gradient line (scrolled state indicator) */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-[1px]
            bg-gradient-to-r from-transparent via-blue-500/30 to-transparent
            transition-opacity duration-500
            ${isScrolled ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </header>
    </>
  )
}

export default Header
