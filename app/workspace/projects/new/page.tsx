"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/builder?project=${data.project._id}`)
      } else {
        setError(data.error || "Failed to create project")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPublic: checked,
    }))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-blue-100">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/workspace/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
        <p className="text-blue-200">Start building your wireframe project</p>
      </div>

      {/* Form */}
      <Card className="bg-white/10 backdrop-blur-xl ring-1 ring-white/10">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Give your project a name and description to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="My Awesome Wireframe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe what this wireframe project is about..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder:text-blue-200"
              />
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={handleCheckboxChange}
              />
              <div className="space-y-1">
                <Label htmlFor="isPublic" className="text-sm font-medium">
                  Make this project public
                </Label>
                <p className="text-xs text-gray-500">
                  Public projects can be viewed by others and may appear in search results
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href="/workspace/projects"
                className="px-4 py-2 text-sm text-blue-200 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Preview mode - could open in new tab
                    console.log("Preview project")
                  }}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.name.trim()}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Project Templates */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/5 rounded-lg hover:border-blue-300/60 hover:bg-blue-500/10 transition-colors cursor-pointer">
            <h3 className="font-medium text-gray-900 mb-2">Dashboard Wireframe</h3>
            <p className="text-sm text-blue-200 mb-3">Pre-configured with common dashboard components</p>
            <Button variant="outline" size="sm" className="text-blue-100">
              Use Template
            </Button>
          </div>
          <div className="p-4 border border-white/10 bg-white/5 rounded-lg hover:border-green-300/60 hover:bg-green-500/10 transition-colors cursor-pointer">
            <h3 className="font-medium text-white mb-2">Mobile App Wireframe</h3>
            <p className="text-sm text-blue-200 mb-3">Optimized for mobile app design and layout</p>
            <Button variant="outline" size="sm" className="text-blue-100">
              Use Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
