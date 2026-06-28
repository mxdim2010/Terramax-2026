import { randomUUID } from "node:crypto"

import { NextResponse } from "next/server"

import { getProjectById, saveHandoffLead } from "@/lib/interior-design-store"

type HandoffPayload = {
  projectId?: string
  name?: string
  email?: string
  phone?: string
  message?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandoffPayload

    if (!body.projectId || !body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Project, name, and email are required.",
        },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 },
      )
    }

    const project = await getProjectById(body.projectId)
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found.",
        },
        { status: 404 },
      )
    }

    const lead = await saveHandoffLead({
      id: randomUUID(),
      projectId: body.projectId,
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim(),
      message: body.message?.trim(),
      createdAt: new Date().toISOString(),
    })

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: "TerraMax Design Handoff <noreply@terramaxdev.com>",
          to: ["contact@terramaxdev.com"],
          replyTo: lead.email,
          subject: `Interior Designer Handoff Requested: ${project.projectName}`,
          html: `
            <h2>Designer Handoff Request</h2>
            <p><strong>Project:</strong> ${project.projectName}</p>
            <p><strong>Room:</strong> ${project.request.roomType}</p>
            <p><strong>Style:</strong> ${project.request.style}</p>
            <p><strong>Budget:</strong> ${project.request.budget}</p>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone || "Not provided"}</p>
            <p><strong>Message:</strong> ${lead.message || "Not provided"}</p>
          `,
        })
      } catch (emailError) {
        console.error("Designer handoff email error:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      lead,
      message: "Designer handoff request submitted successfully.",
    })
  } catch (error) {
    console.error("Designer handoff error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit handoff request.",
      },
      { status: 500 },
    )
  }
}
