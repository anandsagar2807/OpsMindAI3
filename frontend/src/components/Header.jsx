import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Sparkles, ChevronRight } from 'lucide-react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinkClass = (path) => `
    relative group font-medium tracking-wide transition-all duration-300 ease-out
    ${location.pathname === path 
      ? 'text-blue-300' 
      : 'text-neutral-300 hover:text-white'
    }
  `

  const underlineClass = `
    absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500
    bg-[length:200%_100%] transition-all duration-300 ease-out
    group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-cyan-400
    animate-gradient-x
  `

  return (
    <>
      {/* Premium Grain Overlay for Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

      <header
        className={`
          fixed top-0 left-0 right-0 z-50 isolate transition-all duration-500 ease-out
          ${isScrolled 
            ? 'bg-[rgba(8,12,20,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-floating py-3' 
            : 'bg-transparent border-b border-transparent py-5'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Premium Logo Section */}
            <div className="flex items-center gap-3.5">
              {/* Gradient Logo Circle with refined glass effect */}
              <Link to="/" className="relative group">
                <div className="relative">
                  {/* Glow effect behind logo */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Main logo container */}
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-[2px] shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-[1.03]">
                    <div className="w-full h-full rounded-[9px] bg-gradient-to-br from-[#0a0f1a] to-[#111827] flex items-center justify-center overflow-hidden">
                      {/* Subtle inner gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent" />
                      <Brain className="w-7 h-7 text-white relative z-10 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    </div>
                  </div>
                </div>

                {/* Animated border ring on hover */}
                <div className="absolute -inset-1 rounded-2xl border border-blue-500/0 group-hover:border-blue-500/30 transition-all duration-300 pointer-events-none" />
              </Link>

              {/* Brand name with elegant serif typography */}
              <div className="flex flex-col">
                <Link 
                  to="/" 
                  className="group relative"
                >
                  <h1 className="text-2xl font-playfair font-bold tracking-tight leading-none">
                    <span className="bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent bg-[length:200%_auto] group-hover:bg-[position:0%_0%] transition-all duration-700 ease-out">
                      OpsMind
                    </span>
                    <span className="text-blue-400"> AI</span>
                  </h1>
                </Link>
                
                {/* Premium tagline with subtle animation */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-blue-400/70 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-semibold">
                    Enterprise AI Platform
                  </span>
                  {/* Animated dot separator */}
                  <span className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse-subtle" />
                </div>
              </div>
            </div>

            {/* Navigation with animated underlines */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { path: '/features', label: 'Features' },
                { path: '/pricing', label: 'Pricing' },
                { path: '/about', label: 'About' }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setIsHovered(item.path)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={navLinkClass(item.path)}
                >
                  <span className="relative z-10">
                    {item.label}
                  </span>
                  
                  {/* Animated gradient underline */}
                  <span 
                    className={underlineClass}
                    style={{
                      width: isHovered === item.path || location.pathname === item.path ? '100%' : '0%',
                      transitionDuration: '300ms'
                    }}
                  />
                  
                  {/* Hover glow effect */}
                  <span 
                    className="absolute -bottom-1 left-0 h-[2px] bg-blue-400/50 blur-[2px] transition-opacity duration-300"
                    style={{
                      width: isHovered === item.path ? '100%' : '0%',
                      opacity: isHovered === item.path ? 1 : 0
                    }}
                  />
                </Link>
              ))}
            </nav>

            {/* Auth Buttons with Premium Styling */}
            <div className="flex items-center gap-4">
              <Show when="signed-out">
                {/* Sign In - Ghost style with hover effects */}
                <SignInButton mode="modal">
                  <button className="
                    relative group px-5 py-2.5 text-sm font-medium
                    text-neutral-300 hover:text-white
                    transition-all duration-300 ease-out
                    hover:bg-[rgba(255,255,255,0.05)]
                    rounded-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]
                  ">
                    <span className="relative z-10">Sign In</span>
                    
                    {/* Hover background gradient */}
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-cyan-400/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Subtle border on hover */}
                    <span className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-white/[0.08] transition-all duration-300" />
                  </button>
                </SignInButton>

                {/* Get Started - Premium gradient button */}
                <SignUpButton mode="modal">
                  <button className="
                    relative group px-6 py-2.5 text-sm font-semibold
                    text-white overflow-hidden
                    transition-all duration-300 ease-out
                    rounded-lg
                    shadow-[0_4px_14px_0_rgba(59,130,246,0.4)]
                    hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]
                    hover:-translate-y-0.5
                    active:scale-[0.98]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]
                  ">
                    {/* Animated background gradient */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-[length:200%_100%] group-hover:bg-[position:0%_0%] transition-all duration-700 ease-out" />
                    
                    {/* Shimmer effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                    
                    {/* Inner glow */}
                    <span className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <span className="relative flex items-center gap-2 z-10">
                      Get Started
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>

                    {/* Animated border glow */}
                    <span className="absolute inset-0 rounded-lg border border-blue-400/20 group-hover:border-blue-400/40 transition-all duration-300" />
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <Link
                  to="/dashboard"
                  className="
                    relative group px-5 py-2.5 text-sm font-medium
                    text-neutral-300 hover:text-white
                    transition-all duration-300 ease-out
                    hover:bg-[rgba(255,255,255,0.05)]
                    rounded-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1a]
                  "
                >
                  <span className="relative flex items-center gap-2">
                    Dashboard
                    <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>

                  {/* Hover background */}
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-cyan-400/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                
                <div className="relative">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-lg overflow-hidden ring-2 ring-white/10 hover:ring-blue-500/50 transition-all duration-300",
                        userAvatarBox: "w-full h-full"
                      }
                    }}
                  />
                </div>
              </Show>
            </div>
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
