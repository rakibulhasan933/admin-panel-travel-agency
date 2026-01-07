import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

interface ContactFormData {
  name: string
  email?: string
  phone: string
  message: string
  service: string
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.phone || !data.service || !data.message) {
      return NextResponse.json({ success: false, error: "Please fill in all required fields." }, { status: 400 })
    }

    // Construct HTML email content

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Momu Travels & Tours</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">                      
                      <!-- Contact Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #e4e4e7;">
                            <p style="margin: 0; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</p>
                            <p style="margin: 5px 0 0 0; color: #18181b; font-size: 16px; font-weight: 600;">${data.name} for ${data.service}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #e4e4e7;">
                            <p style="margin: 0; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</p>
                            <p style="margin: 5px 0 0 0; color: #18181b; font-size: 16px;">
                              <a href="mailto:${data.email}" style="color: #0ea5e9; text-decoration: none;">${data.email}</a>
                            </p>
                          </td>
                        </tr>
                        ${data.phone
        ? `
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #e4e4e7;">
                            <p style="margin: 0; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</p>
                            <p style="margin: 5px 0 0 0; color: #18181b; font-size: 16px;">
                              <a href="tel:${data.phone}" style="color: #0ea5e9; text-decoration: none;">${data.phone}</a>
                            </p>
                          </td>
                        </tr>
                        `
        : ""
      }
                      </table>
                      
                      <!-- Message -->
                      <div style="background-color: #f4f4f5; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                        <p style="margin: 0 0 10px 0; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                        <p style="margin: 0; color: #18181b; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
                      </div>
                      
                      <!-- Reply Button -->
                      <div style="text-align: center;">
                        <a href="mailto:${data.email}" 
                           style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                          Reply to ${data.name}
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f4f4f5; padding: 25px 40px; text-align: center;">
                      <p style="margin: 0; color: #71717a; font-size: 13px;">
                        This email was sent from the Momu Travels & Tours contact form.
                      </p>
                      <p style="margin: 10px 0 0 0; color: #a1a1aa; font-size: 12px;">
                        Received on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    // Create transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true" ? false : true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });


    // Send email
    await transporter.sendMail({
      from: `"Momu Travels & Tours" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: data.email,
      subject: `[Momu Travels & Tours] from ${data.name} regarding ${data.service}`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // console.error("Failed to send email:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send email. Please try again later." },
      { status: 500 },
    )
  }
}
