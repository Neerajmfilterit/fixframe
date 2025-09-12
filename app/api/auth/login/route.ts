import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const users = db.collection("users")

    const user = await users.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, (user as any).password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken((user as any)._id.toString())

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: (user as any)._id,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          email: (user as any).email,
        },
      },
      { status: 200 },
    )

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


