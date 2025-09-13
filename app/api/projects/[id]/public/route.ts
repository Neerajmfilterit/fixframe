import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/projects/[id]/public - Get a shared project without authentication
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const url = new URL(request.url)
    const permission = url.searchParams.get('permission')

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    if (!permission) {
      return NextResponse.json({ error: "Permission token required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const projectShares = db.collection("projectShares")

    // Verify the share token exists and is valid
    const share = await projectShares.findOne({
      projectId: new ObjectId(id),
      shareToken: permission,
      expiresAt: { $gt: new Date() } // Check if not expired
    })

    if (!share) {
      return NextResponse.json({ error: "Invalid or expired share link" }, { status: 404 })
    }

    // Get the project data
    const project = await projects.findOne({ _id: new ObjectId(id) })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Add permission info to the project
    project.userPermission = share.permissions
    project.isShared = true
    project.isPublicAccess = true

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching shared project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
