import { SignUp } from '@clerk/react'
import AuthSplitLayout from '../components/auth/AuthSplitLayout'

const Register = () => {
  return (
    <AuthSplitLayout mode="register">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-glass-card rounded-2xl p-8 sm:p-10">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-heading font-bold tracking-tight">
              Create your account
            </h2>
            <p className="text-white/70 mt-2 text-sm">
              Premium authentication experience for OpsMind AI
            </p>
          </div>

          <SignUp
            routing="path"
            path="/register"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: 'w-full text-white',
                card: 'shadow-none border-0 bg-transparent p-0',
                header: 'hidden',
                socialButtonsBlockButton:
                  'w-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 rounded-xl py-3 flex items-center justify-center gap-3',
                socialButtonsBlockButtonText: 'text-white font-semibold',
                dividerLine: 'bg-white/10',
                dividerText: 'text-white/60 font-semibold',
                formButtonPrimary:
                  'w-full rounded-xl py-3 font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-400 shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] transition-all duration-200',
                formFieldLabel: 'text-white/70 text-sm',
                formFieldInput:
                  'bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-transparent transition-all duration-200',
                footerActionLink:
                  'text-white/70 hover:text-white transition-colors font-semibold',
                footer: 'text-white/60 text-xs mt-6 flex flex-col gap-2 items-center',
                link: 'text-white/80 hover:text-white underline underline-offset-4',
              },
            }}
          />

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-xs">
              Secured by <span className="text-white/80 font-semibold">Clerk</span>
            </p>
            <p className="text-white/60 text-xs mt-2">
              By continuing, you agree to our{' '}
              <a href="#" className="text-white/80 hover:text-white font-semibold">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-white/80 hover:text-white font-semibold">
                Privacy Policy
              </a>
            </p>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/60">Already have an account? </span>
            <a href="/login" className="text-white/90 font-semibold hover:text-white">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  )
}

export default Register
