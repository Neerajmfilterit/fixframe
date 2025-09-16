import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import clientPromise from "@/lib/mongodb"
import { Project } from "@/lib/schemas"
import { ObjectId } from "mongodb"

// POST /api/projects/prebuilt-dashboard - Create a new project with prebuilt analytics dashboard layout
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const client = await clientPromise
    const db = client.db("wireframe-builder")
    const projects = db.collection("projects")

    // Prebuilt analytics dashboard layout matching the provided wireframe image
    const prebuiltCharts = [
      // Top Row - Three Metric Cards (each spanning 4 columns in 12-column grid)
      {
        id: "total-installs-card",
        type: "card",
        title: "Total Installs",
        x: 50,
        y: 50,
        width: 300,
        height: 120,
        data: {
          cardTitle: "Total Installs",
          content: "2,546,247"
        },
        titleColor: "#1f2937",
        titleSize: 16,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        shadow: true,
        animation: false,
        comments: []
      },
      {
        id: "valid-installs-card",
        type: "card",
        title: "Valid Installs",
        x: 400,
        y: 50,
        width: 300,
        height: 120,
        data: {
          cardTitle: "Valid Installs",
          content: "2,524,700"
        },
        titleColor: "#1f2937",
        titleSize: 16,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        shadow: true,
        animation: false,
        comments: []
      },
      {
        id: "invalid-installs-card",
        type: "card",
        title: "Invalid Installs",
        x: 750,
        y: 50,
        width: 300,
        height: 120,
        data: {
          cardTitle: "Invalid Installs",
          content: "21,547"
        },
        titleColor: "#1f2937",
        titleSize: 16,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        shadow: true,
        animation: false,
        comments: []
      },
      // Bottom Left - Donut Chart (spanning 6 columns)
      {
        id: "split-sources-donut",
        type: "donut",
        title: "Split Of Sources",
        x: 50,
        y: 220,
        width: 500,
        height: 400,
        data: [
          { name: "Affiliate", value: 92000, color: "#3b82f6" },
          { name: "Organic", value: 1616000, color: "#f97316" },
          { name: "Google Meta", value: 835000, color: "#8b5cf6" }
        ],
        titleColor: "#1f2937",
        titleSize: 18,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        shadow: true,
        animation: true,
        comments: []
      },
      // Bottom Right - Combo Chart (spanning 6 columns)
      {
        id: "date-trend-combo",
        type: "combo",
        title: "Date Wise Trend",
        x: 600,
        y: 220,
        width: 500,
        height: 400,
        data: [
          { name: "2025-09-06", barValue: 285000, lineValue: 0.75, barColor: "#059669", lineColor: "#dc2626" },
          { name: "2025-09-07", barValue: 290000, lineValue: 0.78, barColor: "#059669", lineColor: "#dc2626" },
          { name: "2025-09-08", barValue: 295000, lineValue: 0.82, barColor: "#059669", lineColor: "#dc2626" },
          { name: "2025-09-09", barValue: 300000, lineValue: 0.85, barColor: "#059669", lineColor: "#dc2626" },
          { name: "2025-09-10", barValue: 310000, lineValue: 0.88, barColor: "#059669", lineColor: "#dc2626" },
          { name: "2025-09-11", barValue: 315000, lineValue: 0.92, barColor: "#059669", lineColor: "#dc2626" },
          { name: "2025-09-12", barValue: 320000, lineValue: 0.95, barColor: "#059669", lineColor: "#dc2626" }
        ],
        titleColor: "#1f2937",
        titleSize: 18,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 8,
        shadow: true,
        animation: true,
        comments: []
      }
    ]

    const newProject: Omit<Project, "_id"> = {
      userId: new ObjectId(user._id),
      name: "Analytics Dashboard Template",
      description: "Prebuilt analytics dashboard with install metrics, source breakdown, and trend analysis",
      isPublic: false,
      charts: prebuiltCharts,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["template", "analytics", "dashboard", "prebuilt"]
    }

    const result = await projects.insertOne(newProject)

    return NextResponse.json(
      { 
        message: "Prebuilt analytics dashboard project created successfully",
        project: { _id: result.insertedId, ...newProject }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating prebuilt analytics dashboard project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
