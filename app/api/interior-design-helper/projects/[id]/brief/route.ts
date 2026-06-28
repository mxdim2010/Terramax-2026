import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { NextResponse } from "next/server"

import { getProjectById } from "@/lib/interior-design-store"

type Params = {
  params: Promise<{ id: string }>
}

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    const project = await getProjectById(id)

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      )
    }

    const pdf = await PDFDocument.create()
    const page = pdf.addPage([595, 842])
    const headingFont = await pdf.embedFont(StandardFonts.HelveticaBold)
    const bodyFont = await pdf.embedFont(StandardFonts.Helvetica)

    let y = 790

    const drawHeading = (text: string) => {
      page.drawText(text, {
        x: 50,
        y,
        size: 14,
        font: headingFont,
        color: rgb(0.08, 0.08, 0.08),
      })
      y -= 22
    }

    const drawLine = (text: string) => {
      page.drawText(text, {
        x: 50,
        y,
        size: 10,
        font: bodyFont,
        color: rgb(0.2, 0.2, 0.2),
      })
      y -= 15
    }

    const drawList = (items: string[]) => {
      items.forEach((item) => {
        drawLine(`- ${item}`)
      })
      y -= 8
    }

    drawHeading("TerraMax Interior Design Brief")
    drawLine(`Project: ${project.projectName}`)
    drawLine(`Created: ${new Date(project.createdAt).toLocaleString()}`)
    drawLine(`Room: ${project.request.roomType}`)
    drawLine(`Style: ${project.request.style}`)
    drawLine(`Budget: ${project.request.budget}`)
    drawLine(`Dimensions: ${project.request.width}m x ${project.request.length}m`)
    y -= 10

    drawHeading("Summary")
    drawLine(project.concept.summary)
    y -= 8

    drawHeading("Layout Plan")
    drawList(project.concept.layoutPlan)

    drawHeading("Furniture Direction")
    drawList(project.concept.furniturePlan)

    drawHeading("Decoration Notes")
    drawList(project.concept.decorationPlan)

    drawHeading("Fit Warnings")
    drawList(project.concept.fitWarnings.length > 0 ? project.concept.fitWarnings : ["No major fit risks detected."])

    drawHeading("Image Insights")
    drawList(project.concept.imageInsights)

    drawHeading("Next Steps")
    drawList(project.concept.nextSteps)

    const bytes = await pdf.save()
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes)
        controller.close()
      },
    })
    const fileName = `${sanitizeFileName(project.projectName) || "design-brief"}.pdf`

    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${fileName}\"`,
      },
    })
  } catch (error) {
    console.error("Project brief export error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate project brief.",
      },
      { status: 500 },
    )
  }
}
