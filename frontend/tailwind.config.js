/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep neutrals and sophisticated dark tones
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Muted metallics and steels
        steel: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#98aabf',
          400: '#748aa2',
          500: '#5a7086',
          600: '#4a5a6e',
          700: '#3d4f60',
          800: '#2d3a48',
          900: '#1a2332',
        },
        platinum: {
          50: '#f5f7fa',
          100: '#e9ecef',
          200: '#d1d9e0',
          300: '#b8c4cc',
          400: '#9aa7b2',
          500: '#7d8a99',
          600: '#636e7c',
          700: '#4d5763',
          800: '#38404a',
          900: '#23292f',
        },
        graphite: {
          50: '#f8f9fa',
          100: '#eff1f3',
          200: '#d8dce0',
          300: '#bdc3c8',
          400: '#99a1ac',
          500: '#757d88',
          600: '#5c636d',
          700: '#454b54',
          800: '#2e343a',
          900: '#171b1e',
        },
        titanium: {
          50: '#f6f7f8',
          100: '#ebedf0',
          200: '#d5d8dd',
          300: '#b8bfc5',
          400: '#969ea5',
          500: '#777f89',
          600: '#5d646d',
          700: '#464a53',
          800: '#2e3136',
          900: '#191b1d',
        },
        // Rich dark tones for backgrounds
        obsidian: {
          50: '#f1f2f6',
          100: '#e4e5e9',
          200: '#c8c9cc',
          300: '#a9aaad',
          400: '#8a8b8e',
          500: '#6b6c6f',
          600: '#555659',
          700: '#3f4042',
          800: '#2a2b2c',
          900: '#151516',
          950: '#0a0a0b',
        },
        // Accent colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        muted: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Glass UI colors
        glass: {
          white: 'rgba(255, 255, 255, 0.12)',
          light: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(0, 0, 0, 0.12)',
          stroke: 'rgba(255, 255, 255, 0.15)',
        },
        // Dark theme utility colors (used across UI components)
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        // Elegant serif fonts for headings and authority
        serif: [
          'Cormorant Garamond',
          'Merriweather',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        // Modern, clean sans-serif for UI and body
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        // Monospace for code and technical content
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Consolas',
          'Monaco',
          'Andale Mono',
          'monospace',
        ],
        // Elegant display font for premium branding
        display: [
          'Clash Display',
          'Poppins',
          'Montserrat',
          'system-ui',
          'sans-serif',
        ],
        // Premium heading font
        heading: [
          'Playfair Display',
          'Cormorant Garamond',
          'Georgia',
          'serif',
        ],
      },
      boxShadow: {
        // Premium elevated shadows
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'premium-xl': '0 40px 60px -15px rgba(0, 0, 0, 0.15)',
        'premium-2xl': '0 60px 80px -20px rgba(0, 0, 0, 0.2)',
        // Glass effects
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-md': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.45)',
        'glass-blur': '0 4px 24px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-card': '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-elevated': '0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'glass-floating': '0 20px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        // Sophisticated depth shadows
        'depth-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'depth-sm': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'depth-md': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.06)',
        'depth-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
        'depth-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 12px 20px -8px rgba(0, 0, 0, 0.08)',
        'depth-2xl': '0 40px 80px -20px rgba(0, 0, 0, 0.18), 0 20px 30px -15px rgba(0, 0, 0, 0.12)',
        'depth-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'depth-inset': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'depth-focus': '0 0 0 3px rgba(14, 165, 233, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        // Floating and lift effects
        'lift': '0 12px 20px -8px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'float': '0 10px 20px -8px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 40px -10px rgba(59, 130, 246, 0.15)',
        'glow-primary': '0 0 60px -15px rgba(14, 165, 233, 0.3)',
        'glow-accent': '0 0 50px -12px rgba(34, 197, 94, 0.25)',
        // Metallic shadows
        'metallic': '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-diamond': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(165deg, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
      },
      animation: {
        // Premium entrance animations
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        // Sophisticated micro-interactions
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-premium': 'pulse 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'shine': 'shine 3s ease-in-out infinite',
        'ripple': 'ripple 2s infinite',
        // Premium page transitions
        'page-reveal': 'pageReveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'page-fade': 'pageFade 0.5s ease-out',
        // Glass morphing
        'glass-morph': 'glassMorph 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        // Sophisticated reveals
        'reveal-left': 'revealLeft 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'reveal-right': 'revealRight 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'reveal-up': 'revealUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        // Sign-in page fade in
        'signin-page-fadein': 'signinPageFadeIn 0.8s ease-out forwards',
        // Gradient shimmer for CTA buttons
        'gradient-shimmer': 'gradientShimmer 3s ease-in-out infinite',
      },
      keyframes: {
        // Fade animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // Slide animations
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        // Scale animation
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Classic float
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        // Shine effect for premium look
        shine: {
          '0%, 100%': { backgroundPosition: '-200% 0' },
          '50%': { backgroundPosition: '200% 0' },
        },
        // Shimmer animation
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Ripple effect
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        // Page transitions
        pageReveal: {
          '0%': { clipPath: 'inset(0 0 100% 0)', opacity: '0' },
          '100%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
        },
        pageFade: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // Glass morphing
        glassMorph: {
          '0%': { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(255, 255, 255, 0)' },
          '100%': { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        },
        // Reveal animations
        revealLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        revealRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        revealUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Sign-in page fade in
        signinPageFadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Gradient shimmer for CTA buttons
        gradientShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
        'colors': 'background-color, border-color, color, fill, stroke',
        'easing': 'opacity, background-color, border-color, color, fill, stroke, box-shadow, transform',
        'transform': 'transform',
      },
      transitionDuration: {
        'ultra-fast': '100ms',
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
        'ultra-slow': '800ms',
      },
      transitionTimingFunction: {
        'ease-elastic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-exponential': 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
        'ease-premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-sophisticated': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      opacity: {
        'disabled': '0.5',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
    },
  },
  plugins: [
    // Add any additional plugins here
  ],
}