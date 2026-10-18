import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate 6 digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP securely in database or temporary memory if needed, 
    // for now we send it via Resend email API:
    
    const data = await resend.emails.send({
      from: 'Go Rapid <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Go Rapid 2FA Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #070b14; color: #ffffff; padding: 24px; border-radius: 12px;">
          <h2 style="color: #facc15; text-transform: uppercase; letter-spacing: 2px;">Go Rapid Security</h2>
          <p style="color: #9ca3af; font-size: 14px;">Your 2-Factor Authentication (2FA) verification code is:</p>
          <div style="background-color: #111827; border: 1px solid #374151; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #facc15; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
      `,
    })

    console.log(`[REAL EMAIL 2FA] OTP sent to ${email}`, data)

    return NextResponse.json({
      success: true,
      message: `OTP successfully sent to ${email}`,
      // Note: Hum yahan 'otp' response mein nahi bhej rahe hain taaki screen par show na ho!
    })
  } catch (err: any) {
    console.error('Resend Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
