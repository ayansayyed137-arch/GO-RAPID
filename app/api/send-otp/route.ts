import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY is missing in environment variables' }, { status: 500 })
    }

    // Direct HTTP request to Resend API (No npm package needed!)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
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
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Failed to send email via Resend' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `OTP successfully sent to ${email}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
