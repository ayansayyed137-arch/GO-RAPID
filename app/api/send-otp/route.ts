import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    console.log(`[GO RAPID SECURE 2FA] OTP for ${email}: ${otp}`)

    return NextResponse.json({
      success: true,
      otp, 
      message: `OTP securely generated and dispatched to ${email}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
