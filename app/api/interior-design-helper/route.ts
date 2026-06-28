import { NextResponse } from "next/server"

type DesignRequest = {
  roomType: string
  style: string
  budget: string
  width: string
  length: string
  ceilingHeight?: string
  household?: string
  priorities?: string
}

function parseMeters(value: string): number | null {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function layoutTips(roomType: string, width: number, length: number) {
  const shortSide = Math.min(width, length)
  const longSide = Math.max(width, length)

  if (roomType === "Living Room") {
    return [
      "Anchor the room with a sofa facing a media wall or focal feature.",
      `Keep a main circulation path of at least ${shortSide > 3.5 ? "900mm" : "750mm"} around key furniture.`,
      "Use one large rug to visually connect seating instead of multiple small rugs.",
    ]
  }

  if (roomType === "Bedroom") {
    return [
      "Center the bed on the longest uninterrupted wall where possible.",
      `Allow roughly ${longSide > 4.2 ? "700mm" : "600mm"} clear space on both bed sides.`,
      "Use layered lighting: ceiling, bedside task lights, and soft ambient accents.",
    ]
  }

  if (roomType === "Kitchen") {
    return [
      "Maintain clear work triangles between sink, hob, and fridge.",
      "Use tall storage on one wall to reduce visual clutter in prep areas.",
      "Prioritize under-cabinet lighting for task visibility and warmth.",
    ]
  }

  return [
    "Zone the room by function before selecting furniture.",
    "Start with largest furniture pieces, then fill with secondary items.",
    "Use layered lighting and texture contrast to add depth.",
  ]
}

function furnitureIdeas(roomType: string, budget: string) {
  const premium = budget === "GBP 12,000+"

  if (roomType === "Living Room") {
    return [
      premium ? "3-seat performance-fabric sofa" : "2.5-seat durable fabric sofa",
      "Coffee table with rounded corners",
      "Media unit with concealed cable management",
      premium ? "Accent lounge chair pair" : "One flexible accent chair",
      "Large area rug sized to sit under front furniture legs",
    ]
  }

  if (roomType === "Bedroom") {
    return [
      "Upholstered bed frame with under-bed storage",
      "Blackout curtains with double track",
      "Two bedside tables with integrated charging",
      premium ? "Built-in wardrobe modules" : "Freestanding full-height wardrobes",
      "Textured throw, cushions, and low-glare bedside lamps",
    ]
  }

  if (roomType === "Kitchen") {
    return [
      "Durable quartz-look worktops",
      "Soft-close drawer organizers",
      "Three-layer lighting (ceiling, task, accent)",
      premium ? "Integrated appliance package" : "A-rated standalone appliance set",
      "Easy-clean splashback and moisture-resistant paint",
    ]
  }

  return [
    "Primary functional furniture set",
    "Secondary storage pieces",
    "Layered textiles and decor accents",
    "Task and ambient lighting combination",
    "Durable finishes for high-use zones",
  ]
}

export async function POST(request: Request) {
  try {
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

    const area = width * length

    const response = {
      success: true,
      summary: `${body.style} ${body.roomType.toLowerCase()} concept for approximately ${area.toFixed(1)} m2.`,
      layoutPlan: layoutTips(body.roomType, width, length),
      furniturePlan: furnitureIdeas(body.roomType, body.budget),
      decorationPlan: [
        `Base palette: keep 70% neutral tones, 20% ${body.style.toLowerCase()}-aligned textures, and 10% accent color.`,
        "Use one statement artwork wall and keep remaining walls visually quiet.",
        "Add plants and warm textiles to soften hard surfaces and improve room comfort.",
      ],
      nextSteps: [
        "Validate key furniture dimensions against door swings and window positions.",
        "Create a simple shopping shortlist split into must-buy and phase-2 items.",
        "Upload additional photos for more precise layout and styling iteration.",
      ],
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
