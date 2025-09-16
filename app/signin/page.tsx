"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (res.ok) {
                // Simulate auth for middleware protection
                document.cookie = `isAuthenticated=true; path=/`;
                router.push("/workspace/projects" as any)
            } else {
                setError(data.error || "Login failed")
            }
        } catch {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
            <button
                onClick={() => (window.location.href = "/")}
                className="group absolute bg-gradient-to-r from-slate-600 to-slate-800 hover:from-indigo-700 hover:to-indigo-500 top-4 left-4
             text-white px-6 py-2 rounded-lg font-medium cursor-pointer 
             transition-all duration-300 ease-in-out shadow-md hover:shadow-lg 
             transform hover:-translate-y-0.5 flex items-center justify-center overflow-hidden text-sm"
            >
                <ArrowLeft
                    className="absolute top-3.47 right-2 w-4 h-4 transition-all duration-300 ease-in-out 
               transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                />
                <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-2">
                    Back
                </span>
            </button>

            <div className="w-full max-w-md space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                    <div className="flex items-center justify-center mb-8">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <LogIn className="h-8 w-8 text-slate-700" />
                        </div>
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign in</h1>
                        <p className="text-slate-600">Access your Fixframe workspace</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">{error}</div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all pr-12"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
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
                <div className="text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account? <Link href="/signup" className="text-slate-900 hover:text-slate-700 font-semibold transition-colors">Create one now</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

