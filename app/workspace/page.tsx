"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  BarChart3,
  FileText,
  Clock,
  X,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  ArrowLeft,
  Play
} from "lucide-react"

interface Project {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  charts: any[]
}

export default function WorkspaceDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    isPublic: false
  })
  const [creating, setCreating] = useState(false)
  
  // Animated text state
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const fullText = "Freeze the Frame, Fix the Chaos"

  // Testimonials card carousel (15 cards, 3 per view)
  const testimonials = [
    { name: "PixelForge", quote: "A delightfully fast way to draft dashboards.", rating: 5 },
    { name: "NovaLabs", quote: "Our team ships wireframes 3x faster now.", rating: 4 },
    { name: "DataVista", quote: "Beautiful UI and intuitive interactions.", rating: 5 },
    { name: "FrameX", quote: "Clients love the crisp previews.", rating: 4 },
    { name: "QuantIQ", quote: "The best wireframe builder for modern teams.", rating: 5 },
    { name: "AetherWorks", quote: "Clean, modern, and blazing fast.", rating: 5 },
    { name: "BlueRiver", quote: "Great experience for our design sprints.", rating: 4 },
    { name: "CortexIA", quote: "The preview mode seals client approvals.", rating: 5 },
    { name: "Driftline", quote: "Intuitive controls, zero learning curve.", rating: 5 },
    { name: "EdgePeak", quote: "We iterate ideas in minutes.", rating: 4 },
    { name: "FluxGrid", quote: "Best wireframe tools we’ve tried.", rating: 5 },
    { name: "Graphly", quote: "Charts look premium, clients are impressed.", rating: 5 },
    { name: "HyperNest", quote: "Exactly what our team needed.", rating: 4 },
    { name: "Ionics", quote: "Love the dark theme and UX polish.", rating: 5 },
    { name: "JetLabs", quote: "Saves hours every week.", rating: 5 },
  ]
  const CARDS_PER_VIEW = 3
  const totalGroups = Math.ceil(testimonials.length / CARDS_PER_VIEW)
  const [activeGroup, setActiveGroup] = useState(0)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Typing animation effect
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTyping) {
        // Typing forward
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        } else {
          // Finished typing, wait a bit then start backspacing
          setTimeout(() => {
            setIsTyping(false)
          }, 2000)
        }
      } else {
        // Backspacing
        if (currentIndex > 0) {
          setDisplayedText(fullText.slice(0, currentIndex - 1))
          setCurrentIndex(currentIndex - 1)
        } else {
          // Finished backspacing, wait a bit then start typing again
          setTimeout(() => {
            setIsTyping(true)
          }, 1000)
        }
      }
    }, isTyping ? 100 : 50) // Faster typing, slower backspacing

    return () => clearInterval(typingInterval)
  }, [currentIndex, isTyping, fullText])

  // Auto-rotate carousel (grouped)
  useEffect(() => {
    const id = setInterval(() => {
      setActiveGroup((prev) => (prev + 1) % totalGroups)
    }, 3000)
    return () => clearInterval(id)
  }, [totalGroups])

  const fetchDashboardData = async () => {
    try {
      const projectsRes = await fetch("/api/projects")
      
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.slice(0, 6)) // Show recent 6 projects
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createForm),
      })

      const data = await response.json()

      if (response.ok) {
        setShowCreatePopup(false)
        setCreateForm({ name: "", description: "", isPublic: false })
        fetchDashboardData() // Refresh data
        // Redirect to builder
        window.location.href = `/builder?project=${data.project._id}`
      } else {
        alert(data.error || "Failed to create project")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-white/10 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen  text-gray-900 bg-white">
      {/* Enhanced Animated Background Shapes */}
      <div className="flex-1 relative p-2">
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating shapes - lighter for white background */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg rotate-45 blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 left-16 w-72 h-72 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-1/3 w-80 h-80 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg rotate-12 blur-3xl animate-pulse"></div>
        
        {/* Medium floating shapes */}
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400/8 to-purple-500/8 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-gradient-to-r from-yellow-400/8 to-orange-500/8 rounded-lg rotate-45 blur-2xl"></div>
        
        {/* Small floating shapes */}
        <div className="absolute top-16 left-1/2 w-32 h-32 bg-gradient-to-r from-pink-400/5 to-rose-500/5 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-1/3 right-16 w-40 h-40 bg-gradient-to-r from-blue-400/5 to-cyan-500/5 rounded-lg rotate-12 blur-xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 mb-12">
        <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Soft glow behind the hero */}
          <div className="pointer-events-none absolute -inset-x-20 -top-8 -bottom-8 opacity-40 blur-3xl">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_60%)]"></div>
          </div>

          
          <h1 className="relative text-gray-900 text-4xl md:text-4xl font-bold">
            Welcome back, creator
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-pulse">.</span>
          </h1>
          {/* <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm text-cyan-100 bg-cyan-500/15 ring-1 ring-cyan-400/30 backdrop-blur">
              <Zap className="h-4 w-4 text-cyan-300" /> Supercharged builder
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm text-purple-100 bg-purple-500/15 ring-1 ring-purple-400/30 backdrop-blur">
              <Star className="h-4 w-4 text-purple-300" /> Stunning wireframes
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm text-blue-100 bg-blue-500/15 ring-1 ring-blue-400/30 backdrop-blur">
              <BarChart3 className="h-4 w-4 text-blue-300" /> Built for teams
            </span>
          </div> */}
        </div>
        
        
        {/* Animated Tagline */}
        <div className="mt-10 text-center">
          <div className="inline-block">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {displayedText}
              <span className="animate-pulse text-cyan-400 ml-1">|</span>
            </h2>
            <p className="text-blue-600/70 text-sm mt-2 font-medium">
              Professional wireframe builder for modern teams
            </p>
          </div>
        </div>
      </div>

      

      {/* Quick Actions */}
      <div className="relative z-10 mb-12">
        <div className="grid grid-col md:grid-cols-2 gap-2 ">
          <button
            onClick={() => setShowCreatePopup(true)}
            className="group relative p-8 bg-emerald-500/25 to-teal-600/25 backdrop-blur-xl ring-1 ring-emerald-400/40 rounded-3xl hover:from-emerald-500/35 hover:to-teal-600/35 transition-all duration-300  hover:shadow-2xl hover:shadow-emerald-500/30 "
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg ">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-black mb-1">New Project</h3>
                <p className="text-black">Start building wireframes</p>
              </div>
            </div>
            {/* <ArrowRight className="absolute top-4 right-4 h-5 w-5 text-emerald-300 group-hover:text-white group-hover:translate-x-1 transition-all" /> */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <Link
            href="/workspace/projects"
            className="group relative p-8 bg-gradient-to-br from-rose-500/25 to-pink-600/25 backdrop-blur-xl ring-1 ring-rose-400/40 rounded-3xl hover:from-rose-500/35 hover:to-pink-600/35 transition-all duration-300  hover:shadow-2xl hover:shadow-rose-500/30 "
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl shadow-lg  duration-300">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-black mb-1">Browse Projects</h3>
                <p className="text-black">View all projects</p>
              </div>
            </div>
            {/* <ArrowRight className="absolute top-4 right-4 h-5 w-5 text-rose-300 group-hover:text-white group-hover:translate-x-1 transition-all" /> */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Client Testimonials Carousel */}
      {/* <div className="relative z-10 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">What clients say</h3>
          <div className="flex space-x-2">
            {Array.from({ length: totalGroups }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGroup(idx)}
                className={`h-2 w-8 rounded-full transition-colors ${idx === activeGroup ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/20 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeGroup * 100}%)` }}>
              {Array.from({ length: totalGroups }).map((_, groupIdx) => {
                const start = groupIdx * CARDS_PER_VIEW
                const items = testimonials.slice(start, start + CARDS_PER_VIEW)
                return (
                  <div key={groupIdx} className="min-w-full p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {items.map((client) => (
                        <div key={client.name} className="p-6 rounded-2xl bg-white/10 ring-1 ring-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 min-h-[220px] md:min-h-[260px] flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <div className="text-white text-lg font-bold">{client.name}</div>
                            <div className="flex items-center">
                              {[1,2,3,4,5].map((i) => (
                                <Star key={i} className={`h-4 w-4 ${i <= client.rating ? 'text-yellow-300' : 'text-white/40'}`} />
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 text-blue-100 text-sm leading-relaxed">"{client.quote}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <button
            onClick={() => setActiveGroup((activeGroup - 1 + totalGroups) % totalGroups)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 ring-1 ring-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            aria-label="Previous"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveGroup((activeGroup + 1) % totalGroups)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 ring-1 ring-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
            aria-label="Next"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div> */}

      {/* Enhanced Create Project Popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl ring-1 ring-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-blue-500/25">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {/* <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div> */}
                <h3 className="text-xl font-bold text-white">Create New Project</h3>
              </div>
              <button
                onClick={() => setShowCreatePopup(false)}
                className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Project Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Describe your project..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={createForm.isPublic}
                  onChange={(e) => setCreateForm({...createForm, isPublic: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/10"
                />
                <label htmlFor="isPublic" className="text-sm text-blue-200">
                  Make this project public
                </label>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePopup(false)}
                  className="px-6 py-3 text-sm text-blue-200 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !createForm.name.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-500/25"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      {/* Footer */}
      <footer className="relative z-10 bg-blue-700 text-white  ">
        <div className="w-full mx-auto p-6 rounded-2xl ring-1 ring-white/10 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white font-bold text-lg">FixFrame</div>
              <p className="text-grey-700 text-sm mt-1 max-w-xs">Freeze the Frame, Fix the Chaos.</p>
            </div>
            <div className="">
              <div className="font-bold text-white text-lg mb-1">Product</div>
              <ul className="space-y-1 text-sm">
                <li><a href="/workspace/projects" className="text-white hover:text-emerald-300">Projects</a></li>
                <li><a href="/builder" className="text-white hover:text-emerald-300">Builder</a></li>
                <li><a href="/preview" className="text-white hover:text-emerald-300">Preview</a></li>
              </ul>
            </div>
            <div className="">
              <div className="font-bold text-lg text-white mb-1">Company</div>
              <ul className="space-y-1 text-sm">
                <li><a href="/signup" className="text-white hover:text-emerald-300">Create Account</a></li>
                <li><a href="/" className="text-white hover:text-emerald-300">Sign In</a></li>
              </ul>
            </div>
            <div className="">
              <div className="font-bold text-lg text-white mb-1">Contact</div>
              <p className="text-sm">support@fixframe.app</p>
              {/* <div className="mt-1 flex items-center space-x-2 text-xs">
                <span className="px-2 py-1 rounded bg-white/10 ring-1 ring-white/10 text-blue-200">v2.0</span>
                <span className="px-2 py-1 rounded bg-white/10 ring-1 ring-white/10 text-blue-200">Live</span>
              </div> */}
            </div>
          </div>
          <div className="mt-2  border-t border-white/10 text-center text-white text-xs">
            © {new Date().getFullYear()} FixFrame. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
