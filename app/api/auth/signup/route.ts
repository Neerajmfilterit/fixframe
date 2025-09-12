import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const users = db.collection("users")

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const result = await users.insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const token = generateToken(result.insertedId.toString())

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: result.insertedId,
          firstName,
          lastName,
          email,
        },
      },
      { status: 201 },
    )

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


