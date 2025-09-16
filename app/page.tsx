"use client"

import { useEffect, useState } from "react"
import WorkspaceDashboard from "./workspace/page"
import Link from "next/link"

export default function RootWorkspace() {
  const [checking, setChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/user/profile")
        setIsAuthed(res.ok)
      } catch {
        setIsAuthed(false)
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
      </div>
    )
  }

  // Logged out: show welcome + redirect guards. Logged in: hide welcome, normal behavior.
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  {/* logo box */}
                </div>
                <span className="text-xl font-bold text-slate-900">FixFrame</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {/* Logged-out actions */}
              <Link
                href="/signin"
                className="px-4 py-2 rounded-xl font-medium text-slate-700 bg-white/60 backdrop-blur border border-slate-200 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <WorkspaceDashboard hideWelcome={isAuthed} redirectLoggedOut={!isAuthed} />
      </main>
    </div>
  )
}


