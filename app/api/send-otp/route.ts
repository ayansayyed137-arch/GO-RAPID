import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    // 6-Digit Dynamic OTP Generate karein
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

    return NextResponse.json({
      success: true,
      message: 'OTP Code generated successfully',
      otp: generatedOtp,
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process OTP request' }, { status: 500 })
  }
}
