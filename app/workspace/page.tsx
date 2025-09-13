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
 
  useEffect(() => {
    fetchDashboardData()
  }, [])
 
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Workspace</h1>
        <p className="text-slate-600 mt-2 font-medium">Manage and organize your wireframe projects</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setShowCreatePopup(true)}
              className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <Plus className="h-7 w-7 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Create New Project</h3>
                  <p className="text-slate-600 leading-relaxed">Start building professional wireframes and dashboards</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
           
            <Link
              href="/workspace/projects"
              className="group p-8 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <FileText className="h-7 w-7 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Browse All Projects</h3>
                  <p className="text-slate-600 leading-relaxed">View, manage, and organize your existing projects</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
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
 