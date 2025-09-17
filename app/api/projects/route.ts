import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"
import { Project } from "@/lib/schemas"
import { ObjectId } from "mongodb"

// GET /api/projects - Get all projects for the authenticated user
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")

    const userProjects = await projects
      .find({ userId: new ObjectId(user._id) })
      .sort({ updatedAt: -1 })
      .toArray()

    // Append computed charts count for each project
    const projectsWithCounts = userProjects.map((p: any) => {
      const chartsFromRoot = Array.isArray(p?.charts) ? p.charts.length : 0
      const chartsFromPages = Array.isArray(p?.pages)
        ? p.pages.reduce((sum: number, page: any) => sum + (Array.isArray(page?.charts) ? page.charts.length : 0), 0)
        : 0
      return {
        ...p,
        chartsCount: chartsFromPages > 0 ? chartsFromPages : chartsFromRoot
      }
    })

    return NextResponse.json(projectsWithCounts)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// POST /api/projects - Create a new project
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { name, description = "", isPublic = false } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")

    const newProject: Omit<Project, "_id"> = {
      userId: new ObjectId(user._id),
      name,
      description,
      isPublic,
      charts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    }

    const result = await projects.insertOne(newProject)

    return NextResponse.json(
      { 
        message: "Project created successfully",
        project: { _id: result.insertedId, ...newProject }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
