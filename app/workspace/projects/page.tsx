"use client"
 
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  BarChart3,
  Trash2,
  Edit,
  Eye,
  ArrowLeft,
  X
} from "lucide-react"
 
interface Project {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  charts: any[]
  isPublic: boolean
}
 
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: "",
    description: ""
  })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)
 
  useEffect(() => {
    fetchProjects()
  }, [])
 
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm)
      })
      const data = await response.json()
      if (response.ok) {
        setShowCreatePopup(false)
        setCreateForm({ name: "", description: "" })
        fetchProjects()
        window.location.href = `/builder?project=${data.project._id}`
      } else {
        setCreateError(data.error || "Failed to create project")
      }
    } catch (error) {
      setCreateError("Network error. Please try again.")
    } finally {
      setCreating(false)
    }
  }
 
  const deleteProject = async (projectId: string) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId))
        setShowDeletePopup(false)
        setProjectToDelete(null)
      } else {
        console.error("Delete failed")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setDeleting(false)
    }
  }
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
 
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })
 
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
 
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
            <p className="text-slate-600 mt-2">Manage and organize your wireframe projects</p>
          </div>
          <button
            onClick={() => setShowCreatePopup(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New project
          </button>
        </div>
      </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
        {/* Search + Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 placeholder:text-slate-500 transition-all"
              />
            </div>
          </div>
        </div>
 
        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <div className="p-4 bg-slate-50 rounded-xl w-fit mx-auto mb-6">
              <BarChart3 className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Get started by creating your first wireframe project. Build professional dashboards and wireframes in minutes."
              }
            </p>
            {!searchTerm && (
              <Link
                href="/workspace/projects/new"
                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{project.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {project.description || "No description provided"}
                    </p>
                  </div>
 
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span className="font-medium">Created {formatDate(project.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-2" />
                        <span className="font-medium">{project.charts.length} charts</span>
                      </div>
                      <div className="hidden sm:flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        <span className="font-medium">Updated {formatDate(project.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
 
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/builder?project=${project._id}`}
                        className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Open
                      </Link>
                    </div>
                    <button
                      onClick={() => { setProjectToDelete(project); setShowDeletePopup(true) }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              {createError && (
                <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {createError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Project Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
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
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none transition-all"
                  placeholder="Describe your project goals and requirements..."
                  rows={4}
                />
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
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeletePopup && projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Delete project</h3>
              <button
                onClick={() => { setShowDeletePopup(false); setProjectToDelete(null) }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete “<span className="font-medium text-slate-900">{projectToDelete.name}</span>”? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowDeletePopup(false); setProjectToDelete(null) }}
                className="px-5 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProject(projectToDelete._id)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
 
 