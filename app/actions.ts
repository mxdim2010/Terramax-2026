"use server"

export async function sendContactMessage(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const propertyAddress = formData.get("propertyAddress") as string
  const message = formData.get("message") as string

  if (!firstName || !lastName || !email || !message) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    }
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const emailContent = `
      New Contact Form Submission from TerraMax Developments Website

      Name: ${firstName} ${lastName}
      Email: ${email}
      Phone: ${phone || "Not provided"}
      Property Address: ${propertyAddress || "Not provided"}

      Message:
      ${message}

      ---
      This message was sent from the TerraMax Developments contact form.
    `

    console.log("Email would be sent to: contact@terramaxdev.com")
    console.log("Email content:", emailContent)

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Sorry, there was an error sending your message. Please try again or call us directly.",
    }
  }
}
