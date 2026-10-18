import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer re_9Wu38LgS_AUM768BHia7oPTDFTH2wfrS7`,
      },
      body: JSON.stringify({
        from: 'GO RAPID <onboarding@resend.dev>',
        to: [email],
        subject: 'GO RAPID - Your Sign Up OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto;">
            <h2 style="color: #facc15; text-align: center;">GO RAPID</h2>
            <p>Hello,</p>
            <p>Your verification code for signing up into GO RAPID is:</p>
            <div style="background-color: #111827; border: 1px solid #facc15; font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #facc15; padding: 15px; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #9ca3af;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
          </div>
        `,
      }),
    })

    const data = await resendResponse.json()

    if (!resendResponse.ok) {
      return NextResponse.json({ error: data.message || 'Resend API error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 })
  }
}
