import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"

// GET /api/user/export - Export user data
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const users = db.collection("users")
    const projects = db.collection("projects")
    const activities = db.collection("user_activities")

    // Get user data
    const userData = await users.findOne({ _id: user._id })
    const userProjects = await projects.find({ userId: new ObjectId(user._id) }).toArray()
    const userActivities = await activities.find({ userId: new ObjectId(user._id) }).toArray()

    // Remove sensitive data
    const { password, ...safeUserData } = userData

    const exportData = {
      exportDate: new Date().toISOString(),
      user: safeUserData,
      projects: userProjects,
      activities: userActivities,
      metadata: {
        totalProjects: userProjects.length,
        totalCharts: userProjects.reduce((sum, project) => sum + (project.charts?.length || 0), 0),
        totalActivities: userActivities.length
      }
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="wireframe-builder-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    })
  } catch (error) {
    console.error("Error exporting user data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
