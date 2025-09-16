"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ArrowLeft } from "lucide-react"

const UltimateWireframeBuilder = dynamic(() => import("@/components/UltimateWireframeBuilder"), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-black mx-auto mb-6"></div>
        <p className="text-black text-lg font-semibold" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          Loading wireframe builder...
        </p>
      </div>
    </div>
  )
})

export default function BuilderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get('project')
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(!!projectId)
  const [builderTheme, setBuilderTheme] = useState(false) // Track builder's theme state

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
    }
  }, [projectId])

  const fetchProject = async (id: string) => {
    try {
      const permission = searchParams.get('permission')
      
      let url: string
      if (permission) {
        // Use public endpoint for shared projects (no authentication required)
        url = `/api/projects/${id}/public?permission=${permission}`
      } else {
        // Use regular endpoint for project owners
        url = `/api/projects/${id}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        console.error("Failed to fetch project:", response.statusText)
        if (response.status === 401) {
          console.error("Authentication required. Please log in to access this project.")
        } else if (response.status === 404) {
          console.error("Project not found or share link is invalid/expired.")
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-black mx-auto mb-6"></div>
          <p className="text-black text-lg font-semibold" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Loading project...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-16 w-72 h-72 bg-indigo-500/20 rounded-lg rotate-45 blur-2xl animate-bounce"></div>
        <div className="absolute bottom-16 left-10 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 right-1/4 w-72 h-72 bg-blue-600/20 rounded-lg rotate-12 blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-6 z-50">
        <button
          onClick={() => router.push("/workspace/projects")}
          className={`flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 ${
            builderTheme 
              ? 'bg-white/10 ring-white/10 text-white hover:bg-white/20 hover:ring-white/20' 
              : 'bg-black/10 ring-black/10 text-black hover:bg-black/20 hover:ring-black/20'
          }`}
        >
          <ArrowLeft className={`h-4 w-4 mr-2 ${builderTheme ? 'text-white' : 'text-black'}`} />
          Back
        </button>
      </div>

      {/* Builder - Full Screen */}
      <div className="absolute inset-0 z-10">
        <UltimateWireframeBuilder 
          projectId={projectId}
          initialProject={project}
          onThemeChange={setBuilderTheme}
        />
      </div>
    </div>
  )
}