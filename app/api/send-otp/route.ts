import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Send actual email via Resend
    const { data, error } = await resend.emails.send({
      from: 'GO RAPID <onboarding@resend.dev>',
      to: [email],
      subject: 'Your GO RAPID Secure 2FA Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #fff; border-radius: 12px;">
          <h2 style="color: #facc15; text-transform: uppercase; letter-spacing: 2px;">GO RAPID Secure Auth</h2>
          <p style="color: #cbd5e1;">Your one-time email verification code is:</p>
          <div style="background: #1e293b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #facc15; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">This code is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `OTP successfully sent to ${email}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
