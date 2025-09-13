import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// POST /api/projects/[id]/share - Share a project with users
export const POST = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params
    const { emails, permissions } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const projectShares = db.collection("projectShares")

    // Verify the user owns this project
    const project = await projects.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user._id) 
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Create share records for each email
    const shareRecords = emails.map((emailData: any) => {
      const shareToken = `${id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      return {
        projectId: new ObjectId(id),
        sharedBy: new ObjectId(user._id),
        sharedWith: emailData.userId ? new ObjectId(emailData.userId) : null,
        shareToken: shareToken,
        permissions: emailData.permission || 'view',
        email: emailData.email,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    // Insert share records
    await projectShares.insertMany(shareRecords)

    // Generate share links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shareLinks = shareRecords.map(record => ({
      email: record.email,
      permission: record.permissions,
      link: `${baseUrl}/builder?project=${id}&permission=${record.shareToken}`
    }))

    return NextResponse.json({
      message: "Project shared successfully",
      shareLinks: shareLinks
    })
  } catch (error) {
    console.error("Error sharing project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// GET /api/projects/[id]/share - Get share information for a project
export const GET = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const projectShares = db.collection("projectShares")

    // Verify the user owns this project
    const project = await projects.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user._id) 
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Get all shares for this project
    const shares = await projectShares.find({
      projectId: new ObjectId(id)
    }).toArray()

    return NextResponse.json({
      shares: shares.map(share => ({
        id: share._id,
        email: share.email,
        permissions: share.permissions,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt
      }))
    })
  } catch (error) {
    console.error("Error fetching project shares:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// DELETE /api/projects/[id]/share - Remove share access
export const DELETE = requireAuth(async (request: NextRequest, user, context: { params: { id: string } }) => {
  try {
    const { id } = context.params
    const { shareId } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")
    const projectShares = db.collection("projectShares")

    // Verify the user owns this project
    const project = await projects.findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(user._id) 
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Remove the share
    const result = await projectShares.deleteOne({
      _id: new ObjectId(shareId),
      projectId: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Share access removed successfully" })
  } catch (error) {
    console.error("Error removing project share:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
