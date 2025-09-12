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
    <div className="p-6 text-blue-100">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/workspace"
          className={
            `inline-flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105
             bg-white/10 ring-white/10 text-white hover:bg-white/20 hover:ring-white/20`
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2 text-white" />
          Back to Workspace
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-blue-200">Manage your wireframe projects</p>
          </div>
          <Link
            href="/workspace/projects/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl ring-1 ring-white/10 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-blue-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-blue-300" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              <option value="recent">Recent</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "Try adjusting your search terms or filters."
              : "Get started by creating your first wireframe project."
            }
          </p>
          {!searchTerm && (
            <Link
              href="/workspace/projects/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white/10 backdrop-blur-xl ring-1 ring-white/10 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-blue-200 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  </div>
                  <div className="relative">
                    <button className="p-1 text-blue-200 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-blue-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(project.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {project.charts.length} charts
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/builder?project=${project._id}`}
                      className="px-3 py-1 text-sm bg-blue-500/20 text-blue-100 rounded-md hover:bg-blue-500/30 transition-colors"
                    >
                      <Eye className="h-3 w-3 mr-1 inline" />
                      Open
                    </Link>
                    <Link
                      href={`/preview?project=${project._id}`}
                      className="px-3 py-1 text-sm bg-white/10 text-blue-100 rounded-md hover:bg-white/20 transition-colors"
                    >
                      <Eye className="h-3 w-3 mr-1 inline" />
                      Preview
                    </Link>
                  </div>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="p-1 text-blue-200 hover:text-red-400 transition-colors"
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
  )
}
