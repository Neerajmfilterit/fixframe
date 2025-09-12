"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"

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
    <div className="min-h-screen   bg-zinc-200/80 flex items-center justify-center p-4 relative overflow-hidden">
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/30 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-600/25 rounded-lg rotate-12 animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div> */}

   <div className="min-h-screen flex items-center justify-center ">
  <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 border border-white/20 shadow-2xl">
    <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
    <p className="text-blue-200 text-center text-sm mt-1">
      Sign in to access your projects and continue where you left off
    </p>

    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-blue-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full h-11 px-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-400/40 focus:outline-none"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-blue-200">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-11 px-3 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-400/40 focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-100 transition"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2 text-blue-200">
          <input type="checkbox" className="w-4 h-4 accent-blue-500" />
          <span>Remember me</span>
        </label>
        <a href="/forgot-password" className="text-blue-300 hover:text-blue-200 transition-colors">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>

    {/* Sign up */}
    <p className="text-center text-blue-300 text-sm mt-5">
      Don't have an account?{" "}
      <a href="/signup" className="text-blue-400 hover:text-blue-200 font-semibold transition-colors">
        Create one now
      </a>
    </p>
  </div>
</div>


    </div>
  )
}
