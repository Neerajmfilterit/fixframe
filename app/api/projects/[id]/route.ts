import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/projects/[id] - Get a specific project
export const GET = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params
    const url = new URL(request.url)
    const permission = url.searchParams.get('permission')

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const projectShares = db.collection("projectShares")

    let project = null

    // First, try to find the project as the owner
    project = await projects.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user._id) 
    })

    // If not found as owner, check if it's shared with this user
    if (!project) {
      const share = await projectShares.findOne({
        projectId: new ObjectId(id),
        $or: [
          { sharedWith: new ObjectId(user._id) },
          { shareToken: permission } // Allow access via share token
        ]
      })

      if (share) {
        // Get the project data
        project = await projects.findOne({ _id: new ObjectId(id) })
        
        if (project) {
          // Add permission info to the project
          project.userPermission = share.permissions
          project.isShared = true
        }
      }
    } else {
      // User owns the project
      project.userPermission = 'edit'
      project.isShared = false
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// PUT /api/projects/[id] - Update a project
export const PUT = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params
    const updates = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")

    const updateData = {
      ...updates,
      updatedAt: new Date()
    }

    const result = await projects.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(user._id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const updatedProject = await projects.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// DELETE /api/projects/[id] - Delete a project
export const DELETE = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")

    const result = await projects.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user._id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
