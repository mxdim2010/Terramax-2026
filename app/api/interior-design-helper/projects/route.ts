import { NextResponse } from "next/server"

import { auth } from "@/auth"
import {
  type DesignConcept,
  type DesignRequest,
  generateDesignConcept,
} from "@/lib/interior-design-engine"
import { listProjects, saveProject } from "@/lib/interior-design-store"

export const dynamic = "force-dynamic"

type SaveProjectPayload = {
  projectName?: string
  request?: DesignRequest
  concept?: DesignConcept
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to view projects.",
        },
        { status: 401 },
      )
    }

    const projects = await listProjects(session.user.id)

    return NextResponse.json(
      {
        success: true,
        projects,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
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
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to save projects.",
        },
        { status: 401 },
      )
    }

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

    const project = await saveProject({
      userId: session.user.id,
      projectName: body.projectName?.trim() || `${body.request.roomType} concept`,
      request: body.request,
      concept,
    })

    return NextResponse.json(
      {
        success: true,
        project,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
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
