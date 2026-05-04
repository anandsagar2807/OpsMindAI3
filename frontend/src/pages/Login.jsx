import { SignIn } from '@clerk/clerk-react'
import { Brain } from 'lucide-react'

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OpsMind AI</h1>
          <p className="text-gray-600">Corporate Knowledge Brain</p>
        </div>

        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl border border-gray-200 rounded-2xl",
                headerTitle: "text-2xl font-semibold",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                footerActionLink: "text-indigo-600 hover:text-indigo-700"
              }
            }}
            routing="path"
            path="/login"
            signUpUrl="/register"
          />
        </div>
      </div>
    </div>
  )
}

export default Login
