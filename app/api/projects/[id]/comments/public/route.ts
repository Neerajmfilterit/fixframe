import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/projects/[id]/comments/public - Get comments for a shared project (no auth required)
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

    // Get all comments for the project
    const comments = await db.collection("projectComments").find({
      projectId: new ObjectId(id)
    }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ 
      comments,
      userPermission: share.permissions 
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/projects/[id]/comments/public - Add a comment to a shared project (no auth required)
export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const { content, position, chartId, authorEmail, authorName } = await request.json()
    const url = new URL(request.url)
    const permission = url.searchParams.get('permission')

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    if (!permission) {
      return NextResponse.json({ error: "Permission token required" }, { status: 400 })
    }

    if (!content || !authorEmail) {
      return NextResponse.json({ error: "Content and author email are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
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
      comment,
      userPermission: share.permissions 
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
