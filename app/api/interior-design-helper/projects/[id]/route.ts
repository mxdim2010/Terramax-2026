import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { getProjectById } from "@/lib/interior-design-store"

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to view this project.",
        },
        { status: 401 },
      )
    }

    const { id } = await params
    const project = await getProjectById(session.user.id, id)

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("Get project error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load project.",
      },
      { status: 500 },
    )
  }
}
