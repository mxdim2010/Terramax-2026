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
  floorPlanImageDataUrl?: string
  photoFileNames?: string[]
}

export type DesignConcept = {
  summary: string
  layoutPlan: string[]
  layoutSketchSvg?: string
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

function generateLayoutSketchSvg(roomType: string, style: string, width: number, length: number) {
  const canvas = 560
  const margin = 52
  const interior = canvas - margin * 2
  const maxSide = Math.max(width, length)
  const roomW = Math.round((width / maxSide) * interior)
  const roomH = Math.round((length / maxSide) * interior)
  const roomX = Math.round((canvas - roomW) / 2)
  const roomY = Math.round((canvas - roomH) / 2)

  const palette = {
    bg: "#f6f4ef",
    wall: "#3b3b3b",
    text: "#2a2a2a",
    accent: "#b8860b",
    furniture: "#d7d0bf",
    furnitureStroke: "#5a554a",
    rug: "#e7dfcc",
    path: "#6f8f6f",
    zone: "#f1e5c8",
  }

  const items: string[] = []

  if (roomType === "Living Room") {
    const sofaW = Math.max(110, Math.round(roomW * 0.42))
    const sofaH = Math.max(34, Math.round(roomH * 0.16))
    const sofaX = roomX + Math.round((roomW - sofaW) / 2)
    const sofaY = roomY + roomH - sofaH - 18

    const mediaW = Math.max(90, Math.round(roomW * 0.36))
    const mediaH = 20
    const mediaX = roomX + Math.round((roomW - mediaW) / 2)
    const mediaY = roomY + 14

    const rugW = Math.max(120, Math.round(roomW * 0.52))
    const rugH = Math.max(70, Math.round(roomH * 0.34))
    const rugX = roomX + Math.round((roomW - rugW) / 2)
    const rugY = roomY + Math.round((roomH - rugH) / 2)

    const tableW = Math.max(64, Math.round(roomW * 0.2))
    const tableH = Math.max(42, Math.round(roomH * 0.16))
    const tableX = roomX + Math.round((roomW - tableW) / 2)
    const tableY = rugY + Math.round((rugH - tableH) / 2)

    items.push(`<rect x="${rugX}" y="${rugY}" width="${rugW}" height="${rugH}" fill="${palette.rug}" stroke="#cfc6b0" stroke-width="1"/>`)
    items.push(`<rect x="${sofaX}" y="${sofaY}" width="${sofaW}" height="${sofaH}" rx="8" fill="${palette.furniture}" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${mediaX}" y="${mediaY}" width="${mediaW}" height="${mediaH}" rx="3" fill="#d0c8b4" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${tableX}" y="${tableY}" width="${tableW}" height="${tableH}" rx="6" fill="#eee6d2" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<text x="${sofaX + sofaW / 2}" y="${sofaY + sofaH / 2 + 5}" text-anchor="middle" font-size="12" fill="${palette.text}">SOFA</text>`)
  } else if (roomType === "Bedroom") {
    const bedW = Math.max(120, Math.round(roomW * 0.46))
    const bedH = Math.max(110, Math.round(roomH * 0.44))
    const bedX = roomX + Math.round((roomW - bedW) / 2)
    const bedY = roomY + Math.round((roomH - bedH) / 2) + 12

    const sideW = 26
    const sideH = 34
    const leftX = bedX - sideW - 8
    const rightX = bedX + bedW + 8
    const sideY = bedY + Math.round((bedH - sideH) / 2)

    const wardrobeW = Math.max(40, Math.round(roomW * 0.14))
    const wardrobeH = Math.max(90, Math.round(roomH * 0.42))
    const wardrobeX = roomX + roomW - wardrobeW - 12
    const wardrobeY = roomY + 16

    items.push(`<rect x="${bedX}" y="${bedY}" width="${bedW}" height="${bedH}" rx="8" fill="${palette.furniture}" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${bedX + 10}" y="${bedY + 8}" width="${bedW - 20}" height="${Math.round(bedH * 0.26)}" fill="#ece3cd" stroke="#b9ad91" stroke-width="1"/>`)
    items.push(`<rect x="${leftX}" y="${sideY}" width="${sideW}" height="${sideH}" fill="#e7deca" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${rightX}" y="${sideY}" width="${sideW}" height="${sideH}" fill="#e7deca" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${wardrobeX}" y="${wardrobeY}" width="${wardrobeW}" height="${wardrobeH}" fill="#ddd4bf" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<text x="${bedX + bedW / 2}" y="${bedY + bedH / 2 + 4}" text-anchor="middle" font-size="12" fill="${palette.text}">BED</text>`)
  } else if (roomType === "Kitchen") {
    const runH = Math.max(30, Math.round(roomH * 0.13))
    const runW = Math.max(120, Math.round(roomW * 0.5))
    const islandW = Math.max(110, Math.round(roomW * 0.38))
    const islandH = Math.max(48, Math.round(roomH * 0.2))

    items.push(`<rect x="${roomX + 12}" y="${roomY + 12}" width="${runW}" height="${runH}" fill="#d4ccb9" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${roomX + 12}" y="${roomY + 12 + runH + 8}" width="${runH}" height="${Math.max(90, Math.round(roomH * 0.38))}" fill="#d4ccb9" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${roomX + roomW - runW - 12}" y="${roomY + roomH - runH - 12}" width="${runW}" height="${runH}" fill="#d4ccb9" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${roomX + Math.round((roomW - islandW) / 2)}" y="${roomY + Math.round((roomH - islandH) / 2)}" width="${islandW}" height="${islandH}" rx="6" fill="${palette.furniture}" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<text x="${roomX + roomW / 2}" y="${roomY + roomH / 2 + 4}" text-anchor="middle" font-size="12" fill="${palette.text}">ISLAND</text>`)
  } else {
    const zoneW = Math.max(140, Math.round(roomW * 0.5))
    const zoneH = Math.max(80, Math.round(roomH * 0.32))
    items.push(`<rect x="${roomX + 16}" y="${roomY + 16}" width="${zoneW}" height="${zoneH}" fill="${palette.furniture}" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
    items.push(`<rect x="${roomX + roomW - zoneW - 16}" y="${roomY + roomH - zoneH - 16}" width="${zoneW}" height="${zoneH}" fill="#e8dfcb" stroke="${palette.furnitureStroke}" stroke-width="2"/>`)
  }

  const doorW = Math.max(36, Math.round(roomW * 0.12))
  const doorX = roomX + Math.round((roomW - doorW) / 2)
  const doorY = roomY + roomH - 2

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}" role="img" aria-label="Suggested ${roomType.toLowerCase()} layout sketch">
  <rect width="100%" height="100%" fill="${palette.bg}" />
  <defs>
    <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e9e4d7" stroke-width="1"/>
    </pattern>
  </defs>
  <rect x="18" y="18" width="${canvas - 36}" height="${canvas - 36}" fill="url(#grid)" />
  <rect x="${roomX}" y="${roomY}" width="${roomW}" height="${roomH}" fill="#fffdf8" stroke="${palette.wall}" stroke-width="4" />
  <rect x="${roomX + 8}" y="${roomY + 8}" width="${Math.max(1, roomW - 16)}" height="${Math.max(1, roomH - 16)}" fill="${palette.zone}" opacity="0.2" />
  ${items.join("\n  ")}
  <path d="M ${doorX + 10} ${doorY - 20} Q ${canvas / 2} ${roomY + roomH / 2} ${canvas - 96} ${roomY + 56}" stroke="${palette.path}" stroke-width="2" stroke-dasharray="6 4" fill="none" opacity="0.85"/>
  <line x1="${doorX}" y1="${doorY}" x2="${doorX + doorW}" y2="${doorY}" stroke="#f6f4ef" stroke-width="5" />
  <path d="M ${doorX} ${doorY} A ${doorW} ${doorW} 0 0 0 ${doorX + doorW} ${doorY - doorW}" fill="none" stroke="#8a826f" stroke-width="1.5" stroke-dasharray="3 2" />
  <text x="${canvas / 2}" y="32" text-anchor="middle" font-size="16" fill="${palette.text}" font-family="Arial, sans-serif">Suggested ${roomType} Layout</text>
  <text x="${canvas / 2}" y="${canvas - 24}" text-anchor="middle" font-size="12" fill="#5a5448" font-family="Arial, sans-serif">${width.toFixed(1)}m x ${length.toFixed(1)}m | ${style} style direction</text>
  <text x="36" y="${canvas - 44}" font-size="10" fill="#6a6356" font-family="Arial, sans-serif">Dashed green line = suggested circulation path</text>
  <text x="${doorX + doorW / 2}" y="${doorY - doorW - 6}" text-anchor="middle" font-size="10" fill="#5a5448" font-family="Arial, sans-serif">ENTRY</text>
</svg>`.trim()
}

function generateFloorPlanAwareLayoutSketchSvg(
  roomType: string,
  style: string,
  width: number,
  length: number,
  floorPlanImageDataUrl?: string,
) {
  if (!floorPlanImageDataUrl) {
    return generateLayoutSketchSvg(roomType, style, width, length)
  }

  const canvas = 640
  const margin = 44
  const roomX = margin
  const roomY = margin + 10
  const roomW = canvas - margin * 2
  const roomH = canvas - margin * 2 - 20

  const overlayParts: string[] = []

  if (roomType === "Living Room") {
    overlayParts.push(`<rect x="${roomX + 120}" y="${roomY + roomH - 110}" width="${roomW - 240}" height="74" rx="12" fill="#d8ceb6" stroke="#4d473d" stroke-width="3" opacity="0.92"/>`)
    overlayParts.push(`<rect x="${roomX + roomW / 2 - 56}" y="${roomY + roomH / 2 - 22}" width="112" height="54" rx="8" fill="#f0e6cf" stroke="#4d473d" stroke-width="3" opacity="0.95"/>`)
    overlayParts.push(`<rect x="${roomX + roomW / 2 - 72}" y="${roomY + 18}" width="144" height="20" rx="3" fill="#c9bea5" stroke="#4d473d" stroke-width="2" opacity="0.92"/>`)
  } else if (roomType === "Bedroom") {
    overlayParts.push(`<rect x="${roomX + roomW / 2 - 110}" y="${roomY + roomH / 2 - 94}" width="220" height="188" rx="12" fill="#d8ceb6" stroke="#4d473d" stroke-width="3" opacity="0.92"/>`)
    overlayParts.push(`<rect x="${roomX + roomW / 2 - 88}" y="${roomY + roomH / 2 - 78}" width="176" height="56" fill="#ece1ca" stroke="#9f9377" stroke-width="2" opacity="0.95"/>`)
    overlayParts.push(`<rect x="${roomX + roomW - 82}" y="${roomY + 24}" width="46" height="170" fill="#cbc0a8" stroke="#4d473d" stroke-width="2" opacity="0.92"/>`)
  } else if (roomType === "Kitchen") {
    overlayParts.push(`<rect x="${roomX + 16}" y="${roomY + 16}" width="188" height="34" fill="#cbc0a8" stroke="#4d473d" stroke-width="3" opacity="0.92"/>`)
    overlayParts.push(`<rect x="${roomX + 16}" y="${roomY + 56}" width="34" height="200" fill="#cbc0a8" stroke="#4d473d" stroke-width="3" opacity="0.92"/>`)
    overlayParts.push(`<rect x="${roomX + roomW - 204}" y="${roomY + roomH - 50}" width="188" height="34" fill="#cbc0a8" stroke="#4d473d" stroke-width="3" opacity="0.92"/>`)
    overlayParts.push(`<rect x="${roomX + roomW / 2 - 92}" y="${roomY + roomH / 2 - 34}" width="184" height="68" rx="8" fill="#e9dec6" stroke="#4d473d" stroke-width="3" opacity="0.95"/>`)
  } else {
    overlayParts.push(`<rect x="${roomX + 24}" y="${roomY + 24}" width="230" height="116" fill="#d8ceb6" stroke="#4d473d" stroke-width="3" opacity="0.9"/>`)
    overlayParts.push(`<rect x="${roomX + roomW - 254}" y="${roomY + roomH - 140}" width="230" height="116" fill="#d8ceb6" stroke="#4d473d" stroke-width="3" opacity="0.9"/>`)
  }

  const doorW = 74
  const doorX = roomX + roomW / 2 - doorW / 2
  const doorY = roomY + roomH - 1

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas}" height="${canvas}" viewBox="0 0 ${canvas} ${canvas}" role="img" aria-label="Suggested ${roomType.toLowerCase()} layout over uploaded floor plan">
  <defs>
    <clipPath id="roomClip"><rect x="${roomX}" y="${roomY}" width="${roomW}" height="${roomH}" rx="2"/></clipPath>
  </defs>
  <rect width="100%" height="100%" fill="#f4f0e6"/>
  <rect x="${roomX}" y="${roomY}" width="${roomW}" height="${roomH}" fill="#fbf8ef" stroke="#3f3a30" stroke-width="4"/>
  <image href="${floorPlanImageDataUrl}" x="${roomX}" y="${roomY}" width="${roomW}" height="${roomH}" preserveAspectRatio="xMidYMid meet" clip-path="url(#roomClip)" opacity="0.78"/>
  <rect x="${roomX}" y="${roomY}" width="${roomW}" height="${roomH}" fill="#f8f3e7" opacity="0.18"/>
  ${overlayParts.join("\n  ")}
  <path d="M ${roomX + 40} ${roomY + roomH - 24} Q ${roomX + roomW / 2} ${roomY + roomH / 2} ${roomX + roomW - 40} ${roomY + 72}" stroke="#5a8358" stroke-width="3" stroke-dasharray="7 5" fill="none"/>
  <line x1="${doorX}" y1="${doorY}" x2="${doorX + doorW}" y2="${doorY}" stroke="#f4f0e6" stroke-width="6" />
  <path d="M ${doorX} ${doorY} A ${doorW} ${doorW} 0 0 0 ${doorX + doorW} ${doorY - doorW}" fill="none" stroke="#8a826f" stroke-width="1.5" stroke-dasharray="3 2" />
  <rect x="24" y="20" width="${canvas - 48}" height="30" fill="#1f1f1f" opacity="0.9"/>
  <text x="${canvas / 2}" y="40" text-anchor="middle" font-size="14" fill="#f4f0e6" font-family="Arial, sans-serif">Floor-Plan Overlay | ${roomType} | ${style} | ${width.toFixed(1)}m x ${length.toFixed(1)}m</text>
  <text x="${roomX + 8}" y="${roomY + roomH + 20}" font-size="10" fill="#645d4f" font-family="Arial, sans-serif">Overlay is aligned to uploaded plan bounds and shows placement + circulation suggestions.</text>
</svg>`.trim()
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
    layoutSketchSvg: generateFloorPlanAwareLayoutSketchSvg(
      input.roomType,
      input.style,
      width,
      length,
      input.floorPlanImageDataUrl,
    ),
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
