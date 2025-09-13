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
  ArrowLeft
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
  const [filterStatus, setFilterStatus] = useState("all")
 
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
 
  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
 
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      })
     
      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
 
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
   
    if (filterStatus === "all") return matchesSearch
    if (filterStatus === "recent") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return matchesSearch && new Date(project.updatedAt) > weekAgo
    }
    if (filterStatus === "public") return matchesSearch && project.isPublic
    if (filterStatus === "private") return matchesSearch && !project.isPublic
   
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
            <div className="flex items-center space-x-4">
              <Link
                href="/workspace"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
                <p className="text-slate-600 mt-2 font-medium">Manage and organize your wireframe projects</p>
              </div>
            </div>
            <Link
              href="/workspace/projects/new"
              className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
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
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-slate-300 text-slate-900 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all bg-white"
              >
                <option value="all">All Projects</option>
                <option value="recent">Recent (Last 7 days)</option>
                <option value="public">Public Projects</option>
                <option value="private">Private Projects</option>
              </select>
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                        {project.description || "No description provided"}
                      </p>
                    </div>
                    <div className="relative">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
 
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span className="font-medium">Created {formatDate(project.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-3 w-3 mr-2" />
                      <span className="font-medium">{project.charts.length} charts</span>
                    </div>
                  </div>
 
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/builder?project=${project._id}`}
                        className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2 inline" />
                        Open
                      </Link>
                      <Link
                        href={`/preview?project=${project._id}`}
                        className="px-4 py-2 text-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                      >
                        <Eye className="h-4 w-4 mr-2 inline" />
                        Preview
                      </Link>
                    </div>
                    <button
                      onClick={() => deleteProject(project._id)}
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
 
    </div>
  )
}
 
 