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
  ArrowRight,
  Settings,
  Users
} from "lucide-react"
 
interface Project {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  charts: any[]
}
 
export default function WorkspaceDashboard({ hideWelcome = false, redirectLoggedOut = false }: { hideWelcome?: boolean; redirectLoggedOut?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    isPublic: false
  })
  const [creating, setCreating] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
 
  const fullText = "Freeze the Frame, Fix the Chaos"

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user/profile")
        setIsAuthed(res.ok)
      } catch {
        setIsAuthed(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < fullText.length) {
          setTypedText(fullText.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          setTypedText(fullText.slice(0, currentIndex - 1))
          setCurrentIndex(currentIndex - 1)
        } else {
          // Start typing again after a pause
          setIsDeleting(false)
          setTimeout(() => setCurrentIndex(0), 1000)
        }
      }
    }, isDeleting ? 50 : 100) // Faster deletion, slower typing

    return () => clearTimeout(timeout)
  }, [currentIndex, isDeleting, fullText])
 
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
    <div className="p-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* About Section (hidden when logged in or explicitly hidden) */}
        {!(hideWelcome || isAuthed) && (
        <div className="mb-32 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Welcome to Fixframe</h2>
              <div className="space-y-3 text-slate-600 leading-relaxed mb-8">
                <p>
                  Transform your ideas into professional wireframes with our intuitive drag-and-drop builder. 
                  Perfect for dashboards, apps, and web interfaces.
                </p>
                <p>
                  AI-powered insights help you create exceptional user experiences. From simple mockups to 
                  complex prototypes, we scale with your needs.
                </p>
                <p>
                  Built for designers, developers, and entrepreneurs. Start with a blank canvas or choose 
                  from our extensive component library.
                </p>
              </div>
              <button
                onClick={() => (redirectLoggedOut ? (window.location.href = '/signin') : setShowCreatePopup(true))}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center overflow-hidden"
              >
                <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-3">Get Started</span>
                <ArrowRight className="absolute top-4 right-4 w-4 h-4 transition-all duration-300 ease-in-out transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 h-96 border border-slate-200">
                {/* AI Wireframe Builder Mockup */}
                <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">Fixframe Builder</div>
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Canvas Area */}
                  <div className="p-4 h-full">
                    <div className="grid grid-cols-2 gap-3 h-full">
                      {/* Left Side - Components */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-700 mb-2">Components</div>
                        <div className="space-y-1">
                          <div className="bg-blue-100 rounded p-2 text-xs text-blue-800">📊 Chart</div>
                          <div className="bg-green-100 rounded p-2 text-xs text-green-800">📋 Table</div>
                          <div className="bg-purple-100 rounded p-2 text-xs text-purple-800">🔘 Button</div>
                          <div className="bg-orange-100 rounded p-2 text-xs text-orange-800">📝 Text</div>
                        </div>
                      </div>
                      
                      {/* Right Side - Canvas */}
                      <div className="bg-slate-50 rounded border-2 border-dashed border-slate-300 p-2">
                        <div className="text-xs text-slate-500 mb-2">Canvas</div>
                        <div className="space-y-1">
                          <div className="bg-white rounded border p-1">
                            <div className="h-2 bg-blue-200 rounded mb-1"></div>
                            <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                          </div>
                          <div className="bg-white rounded border p-1">
                            <div className="h-1 bg-slate-200 rounded w-1/2 mb-1"></div>
                            <div className="h-1 bg-slate-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Floating Elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => (redirectLoggedOut ? (window.location.href = '/signin') : setShowCreatePopup(true))}
              className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <Plus className="h-7 w-7 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Create New Project</h3>
                  <p className="text-slate-600 leading-relaxed">Start building professional wireframes and dashboards with AI assistance</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
           
            <Link
              href={redirectLoggedOut ? "/signin" : "/workspace/projects"}
              className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <FileText className="h-7 w-7 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Browse All Projects</h3>
                  <p className="text-slate-600 leading-relaxed">View, manage, and organize your existing wireframe projects</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Fixframe?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-slate-600">Drag-and-drop interface with real-time collaboration</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-slate-600">AI-powered design suggestions and auto-generation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-slate-600">Export to multiple formats: PDF, PNG, React code</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-slate-600">Built-in component library with charts, forms, and UI elements</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">AI Assistant</h4>
                      <p className="text-sm text-slate-600">Always ready to help</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">
                    "I can help you create responsive layouts, suggest color palettes, and optimize your wireframes for better user experience."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powered by Artificial Intelligence</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Experience the future of wireframing with our AI-driven features that understand your design intent 
              and help you create better user experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Suggestions</h3>
              <p className="text-slate-600 leading-relaxed">
                Our AI analyzes your design patterns and suggests optimal layouts, color schemes, and component 
                arrangements to enhance user experience and visual appeal.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Auto-Generation</h3>
              <p className="text-slate-600 leading-relaxed">
                Generate complete wireframes from simple descriptions. Just tell our AI what you want to build, 
                and watch as it creates professional layouts with proper spacing and hierarchy.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Quality Assurance</h3>
              <p className="text-slate-600 leading-relaxed">
                AI-powered validation ensures your wireframes follow best practices for accessibility, usability, 
                and responsive design principles.
              </p>
            </div>
          </div>
        </div>
       

        

        {/* Recent Projects */}
        
      </div>
 
      {/* Create Project Modal */}
      {showCreatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <Plus className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Create New Project</h3>
                  <p className="text-sm text-slate-600">Start building your wireframe</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreatePopup(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
           
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Project Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Enter project name"
                  required
                />
              </div>
             
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none transition-all"
                  placeholder="Describe your project goals and requirements..."
                  rows={4}
                  required
                />
              </div>
             
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={createForm.isPublic}
                  onChange={(e) => setCreateForm({...createForm, isPublic: e.target.checked})}
                  className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-700 font-medium">
                  Make this project public
                </label>
              </div>
             
              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreatePopup(false)}
                  className="px-6 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !createForm.name.trim()}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
 