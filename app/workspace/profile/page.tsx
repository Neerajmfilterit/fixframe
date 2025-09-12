"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Key, 
  Bell, 
  Shield,
  Download,
  Upload
} from "lucide-react"

interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  lastLogin: string
  preferences: {
    notifications: boolean
    theme: string
    language: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    notifications: true,
    theme: "light",
    language: "en"
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          notifications: data.preferences?.notifications || true,
          theme: data.preferences?.theme || "light",
          language: data.preferences?.language || "en"
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          preferences: {
            notifications: formData.notifications,
            theme: formData.theme,
            language: formData.language
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Profile updated successfully!")
        setProfile(data)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const exportData = async () => {
    try {
      const response = await fetch("/api/user/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'user-data.json'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-blue-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-blue-200">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 text-sm text-green-200 bg-green-500/20 border border-green-500/30 rounded-lg">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="notifications">Enable email notifications</Label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member since</span>
                <span className="text-sm font-medium">
                  {profile ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last login</span>
                <span className="text-sm font-medium">
                  {profile ? new Date(profile.lastLogin).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl ring-1 ring-white/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project updates</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly summary</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security alerts</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
