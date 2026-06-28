import { randomUUID } from "node:crypto"

import { NextResponse } from "next/server"

import {
  type DesignConcept,
  type DesignRequest,
  generateDesignConcept,
} from "@/lib/interior-design-engine"
import { listProjects, saveProject } from "@/lib/interior-design-store"

type SaveProjectPayload = {
  projectName?: string
  request?: DesignRequest
  concept?: DesignConcept
}

export async function GET() {
  try {
    const projects = await listProjects()

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error("Projects list error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load projects.",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveProjectPayload

    if (!body.request) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing project request payload.",
        },
        { status: 400 },
      )
    }

    const concept = body.concept ?? generateDesignConcept(body.request)
    const now = new Date().toISOString()

    const project = await saveProject({
      id: randomUUID(),
      projectName: body.projectName?.trim() || `${body.request.roomType} concept`,
      request: body.request,
      concept,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("Save project error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to save project.",
      },
      { status: 500 },
    )
  }
}
