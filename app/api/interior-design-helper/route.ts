import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { type DesignRequest, generateDesignConcept, parseMeters } from "@/lib/interior-design-engine"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to use the interior design helper.",
        },
        { status: 401 },
      )
    }

    const body = (await request.json()) as DesignRequest

    if (!body.roomType || !body.style || !body.budget || !body.width || !body.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide room type, style, budget, and room dimensions.",
        },
        { status: 400 },
      )
    }

    const width = parseMeters(body.width)
    const length = parseMeters(body.length)

    if (!width || !length) {
      return NextResponse.json(
        {
          success: false,
          message: "Room width and length must be valid numbers in meters.",
        },
        { status: 400 },
      )
    }

    const response = {
      success: true,
      ...generateDesignConcept(body),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Interior design helper error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate recommendations at the moment.",
      },
      { status: 500 },
    )
  }
}
