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
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

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
        router.push("/workspace")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 left-12 w-28 h-28 bg-blue-500/25 rounded-lg rotate-12 animate-bounce"></div>
        <div className="absolute bottom-40 right-1/4 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-16 left-16 w-32 h-32 bg-blue-600/20 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-to-l from-indigo-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <Card className="border-blue-500/20 shadow-2xl shadow-blue-900/20 bg-white/10 backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-white">Sign up</CardTitle>
            <CardDescription className="text-blue-200">
              Create your account to start building wireframes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-blue-100">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="h-9 bg-white/5 border-blue-400/30 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/20"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-blue-100">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="h-9 bg-white/5 border-blue-400/30 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/20"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-blue-100">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-9 bg-white/5 border-blue-400/30 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/20"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-blue-100">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="h-9 bg-white/5 border-blue-400/30 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-blue-100">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="h-9 bg-white/5 border-blue-400/30 text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400/20 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className="mt-1 border-blue-400/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="terms" className="text-sm text-blue-200 leading-relaxed">
                  I agree to the{" "}
                  <Link href={"/terms" as any} className="text-blue-300 hover:text-blue-200 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href={"/privacy" as any} className="text-blue-300 hover:text-blue-200 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

           
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-blue-200">
            Already have an account?{" "}
            <Link href="/" className="text-blue-300 hover:text-blue-200 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


