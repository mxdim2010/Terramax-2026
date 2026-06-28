export type DesignRequest = {
  roomType: string
  style: string
  budget: string
  width: string
  length: string
  ceilingHeight?: string
  household?: string
  priorities?: string
  floorPlanFileName?: string
  photoFileNames?: string[]
}

export type DesignConcept = {
  summary: string
  layoutPlan: string[]
  furniturePlan: string[]
  decorationPlan: string[]
  fitWarnings: string[]
  imageInsights: string[]
  nextSteps: string[]
}

export function parseMeters(value: string): number | null {
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

function fitWarnings(roomType: string, width: number, length: number) {
  const warnings: string[] = []
  const shortSide = Math.min(width, length)
  const area = width * length

  if (roomType === "Living Room" && shortSide < 3.1) {
    warnings.push("Room is narrow for a standard 3-seat sofa and coffee table; use slim-profile seating.")
  }

  if (roomType === "Bedroom" && shortSide < 2.9) {
    warnings.push("A king-size bed may reduce circulation; test queen-size layout first.")
  }

  if (roomType === "Kitchen" && shortSide < 2.4) {
    warnings.push("Compact width detected; avoid deep island layouts and prioritize galley flow.")
  }

  if (area < 12) {
    warnings.push("Small footprint detected; include at least one multi-functional storage piece.")
  }

  return warnings
}

function analyzeImageHints(files: string[]) {
  if (files.length === 0) {
    return [
      "No photos uploaded yet. Add 3-5 room photos for stronger style and lighting analysis.",
    ]
  }

  const joined = files.join(" ").toLowerCase()
  const insights: string[] = []

  if (joined.includes("dark") || joined.includes("night")) {
    insights.push("Photos suggest lower ambient brightness; prioritize layered warm lighting.")
  }

  if (joined.includes("window") || joined.includes("sun")) {
    insights.push("Natural light cues detected; use matte finishes to avoid glare.")
  }

  if (joined.includes("clutter") || joined.includes("storage")) {
    insights.push("Visual clutter indicators found; add closed storage and limit open shelving.")
  }

  if (insights.length === 0) {
    insights.push("Initial image pass complete: prioritize balanced lighting and one focal feature wall.")
  }

  insights.push("Upload front, corner, and doorway angles for a richer second-pass AI layout read.")

  return insights
}

export function generateDesignConcept(input: DesignRequest): DesignConcept {
  const width = parseMeters(input.width)
  const length = parseMeters(input.length)

  if (!width || !length) {
    throw new Error("Room width and length must be valid numbers in meters.")
  }

  const area = width * length

  return {
    summary: `${input.style} ${input.roomType.toLowerCase()} concept for approximately ${area.toFixed(1)} m2.`,
    layoutPlan: layoutTips(input.roomType, width, length),
    furniturePlan: furnitureIdeas(input.roomType, input.budget),
    decorationPlan: [
      `Base palette: keep 70% neutral tones, 20% ${input.style.toLowerCase()}-aligned textures, and 10% accent color.`,
      "Use one statement artwork wall and keep remaining walls visually quiet.",
      "Add plants and warm textiles to soften hard surfaces and improve room comfort.",
    ],
    fitWarnings: fitWarnings(input.roomType, width, length),
    imageInsights: analyzeImageHints(input.photoFileNames ?? []),
    nextSteps: [
      "Validate key furniture dimensions against door swings and window positions.",
      "Create a simple shopping shortlist split into must-buy and phase-2 items.",
      "Request designer handoff once layout and style direction feel aligned.",
    ],
  }
}
