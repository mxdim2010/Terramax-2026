import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const propertyAddress = formData.get("propertyAddress") as string
    const message = formData.get("message") as string

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 },
      )
    }

    console.log("FORM_SUBMISSION_START")
    console.log("Form data:", { firstName, lastName, email, phone, propertyAddress, message })

    const hasApiKey = !!process.env.RESEND_API_KEY
    console.log("Has RESEND_API_KEY:", hasApiKey)

    let emailSent = false

    if (hasApiKey) {
      try {
        console.log("Attempting to send email")

        const { Resend } = await import("resend")
        const resend = new Resend(process.env.RESEND_API_KEY)

        const { error } = await resend.emails.send({
          from: "TerraMax Contact Form <noreply@terramaxdev.com>",
          to: ["contact@terramaxdev.com"],
          replyTo: email,
          subject: `New Contact Form Submission from ${firstName} ${lastName}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Property Address:</strong> ${propertyAddress || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        })

        if (error) {
          console.error("Resend API error:", error)
        } else {
          emailSent = true
          console.log("Email sent successfully")
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
      }
    }

    if (!emailSent) {
      console.log("Email not sent; storing submission in logs")
      console.log("CONTACT_SUBMISSION:", {
        timestamp: new Date().toISOString(),
        firstName,
        lastName,
        email,
        phone,
        propertyAddress,
        message,
      })

      if (!hasApiKey) {
        return NextResponse.json({
          success: true,
          message:
            "Thank you for your message! We have received it and will contact you soon. (Development mode: Email service not configured)",
        })
      }

      return NextResponse.json({
        success: true,
        message:
          "Thank you for your message! We have received it and will contact you soon. If this is urgent, please call us directly at +44 7576039659.",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We will get back to you within 24 hours.",
    })
  } catch (error) {
    console.error("Error in contact API:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Sorry, there was an error sending your message. Please try again or call us directly.",
      },
      { status: 500 },
    )
  }
}
