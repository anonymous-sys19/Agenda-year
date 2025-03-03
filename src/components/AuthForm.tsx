import type React from "react"
import { useState } from "react"
import { useAuthStore } from "../store/auth"
import { toast } from "react-hot-toast"
import { Lock, Mail, User } from "lucide-react"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const { signIn, signUp } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await signIn(email, password)
        toast.success("Welcome back!")
      } else {
        await signUp(email, password, displayName)
        toast.success("Account created successfully!")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1e] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            {isLogin ? "Welcome Back" : "Join Us"}
          </h2>
          <p className="text-cyan-400 text-sm">
            {isLogin ? "Sign in to continue your journey" : "Create your account to get started"}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="display-name" className="block text-sm font-medium text-cyan-400">
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-cyan-500" />
                  </div>
                  <input
                    id="display-name"
                    name="display-name"
                    type="text"
                    required
                    className="block w-full pl-10 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email-address" className="block text-sm font-medium text-cyan-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-500" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-cyan-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_0%,_transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center">
                <Lock className="h-5 w-5 mr-2" />
                {isLogin ? "Sign in" : "Create account"}
              </span>
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  )
}
