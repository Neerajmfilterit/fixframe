"use client"
 
import type React from "react"
 
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import Link from "next/link"
 
export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
 
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
 
    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      setIsLoading(false)
      return
    }
 
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })
 
      const data = await response.json()
 
      if (response.ok) {
        router.push("/workspace/projects")
      } else {
        setError(data.error || "Signup failed")
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <Link
        href="/"
        className="group absolute left-4 top-4 px-4 py-2 rounded-xl text-slate-700 bg-white/70 backdrop-blur border border-slate-200 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 inline-flex items-center justify-center gap-2"
      >
        <span className="inline-flex w-4 justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">←</span>
        <span className="transition-transform duration-300 ease-in-out group-hover:translate-x-1">Back</span>
      </Link>
      <div className="w-full max-w-md space-y-8">
        {/* Signup Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-slate-50 rounded-xl">
              <UserPlus className="h-8 w-8 text-slate-700" />
            </div>
          </div>
         
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Sign up to start building wireframes</p>
          </div>
         
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}
           
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
           
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
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
                  placeholder="Create a strong password"
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
           
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all pr-12"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
           
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-slate-600 focus:ring-slate-300 border-slate-300 rounded mt-1"
              />
              <div>
                <label htmlFor="terms" className="text-sm text-slate-700 font-medium leading-relaxed">
                  I agree to the{" "}
                  <Link href={"/terms" as any} className="text-slate-900 hover:text-slate-700 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href={"/privacy" as any} className="text-slate-900 hover:text-slate-700 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
           
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
 
        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-slate-900 hover:text-slate-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
 
 
 
 