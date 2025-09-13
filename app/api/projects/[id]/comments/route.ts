import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/projects/[id]/comments - Get all comments for a project
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

    let hasAccess = false

    // Check if user owns the project
    const project = await projects.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user._id) 
    })

    if (project) {
      hasAccess = true
    } else if (permission) {
      // Check if user has shared access
      const share = await projectShares.findOne({
        projectId: new ObjectId(id),
        $or: [
          { sharedWith: new ObjectId(user._id) },
          { shareToken: permission }
        ]
      })
      hasAccess = !!share
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get all comments for the project
    const comments = await db.collection("projectComments").find({
      projectId: new ObjectId(id)
    }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// POST /api/projects/[id]/comments - Add a new comment
export const POST = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params
    const { content, position, chartId, authorEmail, authorName } = await request.json()
    const url = new URL(request.url)
    const permission = url.searchParams.get('permission')

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    if (!content || !authorEmail) {
      return NextResponse.json({ error: "Content and author email are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const projectShares = db.collection("projectShares")

    let hasAccess = false
    let userPermission = 'view'

    // Check if user owns the project
    const project = await projects.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user._id) 
    })

    if (project) {
      hasAccess = true
      userPermission = 'edit'
    } else if (permission) {
      // Check if user has shared access
      const share = await projectShares.findOne({
        projectId: new ObjectId(id),
        $or: [
          { sharedWith: new ObjectId(user._id) },
          { shareToken: permission }
        ]
      })
      if (share) {
        hasAccess = true
        userPermission = share.permissions
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Create the comment
    const comment = {
      projectId: new ObjectId(id),
      authorEmail,
      authorName: authorName || authorEmail.split('@')[0],
      content,
      position: position || null,
      chartId: chartId || null,
      isResolved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("projectComments").insertOne(comment)
    comment._id = result.insertedId

    return NextResponse.json({ 
      message: "Comment added successfully", 
      comment 
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
