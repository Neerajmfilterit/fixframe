"use client"
 
import type React from "react"
 
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"
 
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
 
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
 
      const data = await response.json()
 
      if (response.ok) {
        router.push("/workspace" as any)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }
 
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-slate-50 rounded-xl">
              <LogIn className="h-8 w-8 text-slate-700" />
            </div>
          </div>
         
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your account to continue</p>
          </div>
         
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}
           
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
           
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all pr-12"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
           
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-slate-600 focus:ring-slate-300 border-slate-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-slate-700 font-medium">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>
           
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
 
        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-slate-900 hover:text-slate-700 font-semibold transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
 
 