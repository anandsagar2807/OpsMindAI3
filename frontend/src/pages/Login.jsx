import { SignIn } from '@clerk/react'
import AuthSplitLayout from '../components/auth/AuthSplitLayout'

const Login = () => {
  return (
    <AuthSplitLayout mode="login">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-glass-card rounded-2xl p-8 sm:p-10">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-heading font-bold tracking-tight">
              Sign in to OpsMind AI
            </h2>
            <p className="text-white/70 mt-2 text-sm">
              Continue to your corporate knowledge workspace
            </p>
          </div>

          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/register"
            appearance={{
              baseTheme: 'dark',
              elements: {
                card: 'shadow-none border-0 bg-transparent p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
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
                link: 'text-white/80 hover:text-white underline underline-offset-4',
              },
            }}
          />

          <div className="mt-6 flex flex-col items-center text-center gap-2 text-sm">
            <a
              href="/login"
              className="text-white/60 hover:text-white font-semibold"
            >
              Forgot password?
            </a>

            <div className="text-white/60">
              Don&apos;t have an account?{' '}
              <a
                href="/register"
                className="text-white/90 font-semibold hover:text-white"
              >
                Register
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/60">
            Secured by <span className="text-white/80 font-semibold">Clerk</span>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  )
}

export default Login
