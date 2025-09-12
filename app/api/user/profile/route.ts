import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"

// GET /api/user/profile - Get user profile
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const users = db.collection("users")

    const userProfile = await users.findOne({ _id: user._id })

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...profile } = userProfile

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

// PUT /api/user/profile - Update user profile
export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    const updates = await request.json()

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const users = db.collection("users")

    const updateData = {
      ...updates,
      updatedAt: new Date()
    }

    const result = await users.updateOne(
      { _id: user._id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updatedUser = await users.findOne({ _id: user._id })
    const { password, ...profile } = updatedUser

    return NextResponse.json({
      message: "Profile updated successfully",
      ...profile
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
