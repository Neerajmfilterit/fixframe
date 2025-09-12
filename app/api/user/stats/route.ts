import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"

// GET /api/user/stats - Get user statistics
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const activities = db.collection("user_activities")

    // Get project count
    const totalProjects = await projects.countDocuments({ userId: new ObjectId(user._id) })

    // Get total charts across all projects
    const projectsWithCharts = await projects.find({ userId: new ObjectId(user._id) }).toArray()
    const totalCharts = projectsWithCharts.reduce((sum, project) => sum + (project.charts?.length || 0), 0)

    // Get recent activity count (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentActivity = await activities.countDocuments({
      userId: new ObjectId(user._id),
      createdAt: { $gte: weekAgo }
    })

    const stats = {
      totalProjects,
      totalCharts,
      recentActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
