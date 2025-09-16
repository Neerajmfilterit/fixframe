"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Moon, Sun, Smartphone, Tablet, Monitor, Download, Save } from "lucide-react"
import { DarkModeBarChart, DarkModeDonutChart } from "@/components/DarkModeCharts"
import { RechartsLineChart, RechartsAreaChart } from "@/components/RechartsComponents"
import { ShadcnTable } from "@/components/ShadcnTable"
import { ShadcnComboChart } from "@/components/ShadcnComboChart"
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

interface Chart {
  id: string
  type: 'bar' | 'donut' | 'line' | 'area' | 'table' | 'combo'
  title: string
  x: number
  y: number
  width: number
  height: number
  data: any
  titleColor: string
  titleSize: number
  titleWeight: string
  comments: any[]
}

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get('project')
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(!!projectId)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isExporting, setIsExporting] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
    } else {
      setLoading(false)
    }
  }, [projectId])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        if (typeof data.isDarkMode === 'boolean') {
          setIsDarkMode(data.isDarkMode)
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const exportAsPDF = async () => {
    alert('PDF export temporarily disabled for debugging')
  }

  const saveToMongoDB = async () => {
    if (!projectId) return
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: project?.name,
          charts: project?.charts,
          isDarkMode: isDarkMode
        })
      })

      if (response.ok) {
        // Project saved successfully - no popup needed
      } else {
        console.error('Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (!isEditMode) return
    
    e.preventDefault()
    e.stopPropagation()
    setDraggedElement(elementId)
    
    const rect = e.currentTarget.getBoundingClientRect()
    const canvas = document.getElementById('wireframe-canvas')
    if (!canvas) return
    
    const canvasRect = canvas.getBoundingClientRect()
    
    // Calculate offset from mouse to element's current position
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    
    // Set up for smooth dragging
    const element = document.getElementById(elementId)
    if (element) {
      element.style.transition = 'none'
      element.style.willChange = 'transform'
      element.style.transform = 'translateZ(0)'
      element.style.zIndex = '1000'
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedElement || !isEditMode) return
    
    e.preventDefault()
    
    const canvas = document.getElementById('wireframe-canvas')
    if (!canvas) return
    
    const canvasRect = canvas.getBoundingClientRect()
    
    // Calculate new position - exactly where mouse is
    const x = e.clientX - canvasRect.left - dragOffset.x
    const y = e.clientY - canvasRect.top - dragOffset.y
    
    // Update position immediately - exact mouse position
    const element = document.getElementById(draggedElement)
    if (element) {
      element.style.left = `${x}px`
      element.style.top = `${y}px`
      element.style.zIndex = '1000'
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!draggedElement) return
    
    const element = document.getElementById(draggedElement)
    if (element) {
      // Get the exact position where mouse stopped
      const canvas = document.getElementById('wireframe-canvas')
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect()
        const finalX = e.clientX - canvasRect.left - dragOffset.x
        const finalY = e.clientY - canvasRect.top - dragOffset.y
        
        // Set the final position immediately - exactly where mouse stopped
        element.style.left = `${finalX}px`
        element.style.top = `${finalY}px`
        
        // Update the project data with exact position
        if (project && project.charts) {
          const updatedCharts = project.charts.map((chart: any) => {
            if (chart.id === draggedElement) {
              return { ...chart, x: finalX, y: finalY }
            }
            return chart
          })
          
          setProject({ ...project, charts: updatedCharts })
          
          // Save to MongoDB immediately
          saveToMongoDB()
        }
      }
      
      // Reset styles immediately
      element.style.transition = 'none'
      element.style.zIndex = '10'
      element.style.transform = 'translateZ(0)'
      element.style.willChange = 'auto'
    }
    
    setDraggedElement(null)
  }

  useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggedElement, dragOffset])

  const getDeviceStyles = () => {
    switch (deviceView) {
      case 'mobile':
        return {
          maxWidth: '375px',
          margin: '0 auto',
          transform: 'scale(0.8)',
          transformOrigin: 'top center',
          padding: '1rem',
          height: '100%',
          position: 'relative' as const
        }
      case 'tablet':
        return {
          maxWidth: '768px',
          margin: '0 auto',
          transform: 'scale(0.9)',
          transformOrigin: 'top center',
          padding: '1.5rem',
          height: '100%',
          position: 'relative' as const
        }
      default:
        return {
          maxWidth: '100%',
          margin: '0',
          transform: 'scale(1)',
          transformOrigin: 'top left',
          padding: '2rem',
          height: '100%',
          position: 'relative' as const
        }
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!project && !loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project not found</h1>
          <button
            onClick={() => router.push("/workspace/projects")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const charts: Chart[] = project?.charts || []

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-16 w-72 h-72 bg-indigo-500/20 rounded-lg rotate-45 blur-2xl animate-bounce"></div>
        <div className="absolute bottom-16 left-10 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 right-1/4 w-72 h-72 bg-blue-600/20 rounded-lg rotate-12 blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header with controls */}
      <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-gray-50/80 backdrop-blur-sm'}`}>
        <button
          onClick={() => router.push("/workspace/projects")}
          className={`flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'bg-white/10 ring-white/10 text-white hover:bg-white/20 hover:ring-white/20' 
              : 'bg-black/10 ring-black/10 text-black hover:bg-black/20 hover:ring-black/20'
          }`}
        >
          <ArrowLeft className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
          Back
        </button>

        <div className="flex items-center space-x-3">
          {/* Device View Buttons */}
          <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-xl ring-1 ring-white/20 rounded-lg p-1">
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-2 rounded transition-all duration-200 ${
                deviceView === 'mobile' 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-white/10'
              }`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-2 rounded transition-all duration-200 ${
                deviceView === 'tablet' 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-white/10'
              }`}
              title="Tablet View"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-2 rounded transition-all duration-200 ${
                deviceView === 'desktop' 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-white/10'
              }`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 ${
              isEditMode
                ? isDarkMode 
                  ? 'bg-green-500/20 ring-green-400/30 text-green-200 hover:bg-green-500/30 hover:ring-green-400/50' 
                  : 'bg-green-500/20 ring-green-400/30 text-green-700 hover:bg-green-500/30 hover:ring-green-400/50'
                : isDarkMode 
                  ? 'bg-orange-500/20 ring-orange-400/30 text-orange-200 hover:bg-orange-500/30 hover:ring-orange-400/50' 
                  : 'bg-orange-500/20 ring-orange-400/30 text-orange-700 hover:bg-orange-500/30 hover:ring-orange-400/50'
            }`}
          >
            <Edit className={`h-4 w-4 mr-2 ${isEditMode ? (isDarkMode ? 'text-green-200' : 'text-green-700') : (isDarkMode ? 'text-orange-200' : 'text-orange-700')}`} />
            {isEditMode ? 'Exit Edit' : 'Edit Mode'}
          </button>

          <button
            onClick={() => router.push(`/builder?project=${projectId}`)}
            className={`flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-blue-500/20 ring-blue-400/30 text-blue-200 hover:bg-blue-500/30 hover:ring-blue-400/50' 
                : 'bg-blue-500/20 ring-blue-400/30 text-blue-700 hover:bg-blue-500/30 hover:ring-blue-400/50'
            }`}
          >
            <Edit className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`} />
            Open in Builder
          </button>

          <button
            onClick={saveToMongoDB}
            className={`flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-purple-500/20 ring-purple-400/30 text-purple-200 hover:bg-purple-500/30 hover:ring-purple-400/50' 
                : 'bg-purple-500/20 ring-purple-400/30 text-purple-700 hover:bg-purple-500/30 hover:ring-purple-400/50'
            }`}
          >
            <Save className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`} />
            Save
          </button>

          <button
            onClick={exportAsPDF}
            disabled={isExporting}
            className={`flex items-center px-4 py-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
              isDarkMode 
                ? 'bg-green-500/20 ring-green-400/30 text-green-200 hover:bg-green-500/30 hover:ring-green-400/50' 
                : 'bg-green-500/20 ring-green-400/30 text-green-700 hover:bg-green-500/30 hover:ring-green-400/50'
            }`}
          >
            <Download className={`h-4 w-4 mr-2 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`} />
            {isExporting ? 'Exporting...' : 'Save as PDF'}
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 backdrop-blur-xl ring-1 rounded-lg transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/10 ring-white/10 text-yellow-400 hover:bg-white/20 hover:ring-white/20' 
                : 'bg-black/10 ring-black/10 text-gray-600 hover:bg-black/20 hover:ring-black/20'
            }`}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>


      {/* Canvas Container */}
      <div className={`absolute top-20 bottom-0 left-0 right-0 overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Grid Background - Full Canvas */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Device Container */}
        <div 
          className={`w-full h-full ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}
          style={getDeviceStyles()}
        >

          {/* Wireframe Canvas */}
          <div 
            id="wireframe-canvas"
            className="relative w-full h-full"
            style={{ 
              minHeight: deviceView === 'mobile' ? '667px' : deviceView === 'tablet' ? '1024px' : 'calc(100vh - 5rem)',
              width: deviceView === 'mobile' ? '375px' : deviceView === 'tablet' ? '768px' : '100%',
              position: 'relative' as const,
              height: '100%'
            }}
          >
            {charts.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    No wireframes yet
                  </h2>
                  <p className={`mb-6 max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    This project doesn't have any wireframes. Open the builder to start creating.
                  </p>
                  <button
                    onClick={() => router.push(`/builder?project=${projectId}`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Builder
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {charts.map((chart) => {
                  const commonProps = {
                    id: chart.id,
                    title: chart.title,
                    data: chart.data,
                    x: chart.x,
                    y: chart.y,
                    width: chart.width,
                    height: chart.height,
                    isSelected: false,
                    onSelect: () => {},
                    onUpdate: () => {},
                    onDelete: () => {},
                    titleColor: chart.titleColor,
                    titleSize: chart.titleSize,
                    titleWeight: chart.titleWeight,
                    isDarkMode
                  };

                  return (
                    <div
                      key={chart.id}
                      id={chart.id}
                      className={`absolute ${
                        isEditMode 
                          ? 'cursor-move hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 hover:shadow-lg' 
                          : 'cursor-default'
                      } ${draggedElement === chart.id ? 'z-50 opacity-95 shadow-2xl' : 'z-10'}`}
                      style={{ 
                        left: chart.x, 
                        top: chart.y,
                        cursor: isEditMode ? 'move' : 'default',
                        transition: 'none',
                        transform: 'translateZ(0)',
                        userSelect: 'none',
                        willChange: draggedElement === chart.id ? 'left, top' : 'auto',
                        position: 'absolute' as const
                      }}
                      onMouseDown={(e) => handleMouseDown(e, chart.id)}
                    >
                      {chart.type === 'bar' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                        <DarkModeBarChart {...commonProps} type="bar" data={chart.data as { name: string; value: number; color: string }[]} />
                      ) : chart.type === 'donut' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                        <DarkModeDonutChart {...commonProps} type="donut" data={chart.data as { name: string; value: number; color: string }[]} />
                      ) : chart.type === 'line' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                        <RechartsLineChart {...commonProps} type="line" data={chart.data as { name: string; value: number; color: string }[]} />
                      ) : chart.type === 'area' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                        <RechartsAreaChart {...commonProps} type="area" data={chart.data as { name: string; value: number; color: string }[]} />
                      ) : chart.type === 'combo' && Array.isArray(chart.data) && chart.data.length > 0 && 'barValue' in chart.data[0] ? (
                        <ShadcnComboChart {...commonProps} type="combo" data={chart.data as { name: string; barValue: number; lineValue: number; barColor?: string; lineColor?: string }[]} />
                      ) : chart.type === 'table' && !Array.isArray(chart.data) ? (
                        <ShadcnTable {...commonProps} type="table" data={chart.data} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
