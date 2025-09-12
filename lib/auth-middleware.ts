import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"
import clientPromise from "./mongodb"
import { User } from "./schemas"
import { ObjectId } from "mongodb"

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return { user: null, error: "No authentication token" }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return { user: null, error: "Invalid token" }
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return { user: null, error: "User not found" }
    }

    return { user: user as User, error: null }
  } catch (error) {
    console.error("Authentication error:", error)
    return { user: null, error: "Authentication failed" }
  }
}

export function withAuth(handler: (request: NextRequest, user: User) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 })
    }

    return handler(request, user)
  }
}

export function requireAuth(handler: (request: NextRequest, user: User, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any) => {
    const { user, error } = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 })
    }

    return handler(request, user, context)
  }
}
