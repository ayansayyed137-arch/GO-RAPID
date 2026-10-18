import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    const data = await resend.emails.send({
      from: 'GO RAPID <onboarding@resend.dev>',
      to: [email],
      subject: 'GO RAPID - Your Login OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto;">
          <h2 style="color: #facc15; text-align: center;">GO RAPID</h2>
          <p>Hello,</p>
          <p>Your verification code for signing into GO RAPID is:</p>
          <div style="background-color: #111827; border: 1px solid #facc15; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #facc15; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #9ca3af;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 })
  }
}
