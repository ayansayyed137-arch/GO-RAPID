import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: Request) {
  try {
    const { pickup, dropoff, amount, rideId } = await req.json()

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const sessionData: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `GoRapid Ride: ${pickup} to ${dropoff}`,
              description: `Ride ID: ${rideId}`,
            },
            unit_amount: amount * 100, // Amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?booking=success&rideId=${rideId}`,
      cancel_url: `${origin}/?booking=cancelled`,
    }

    const session = await stripe.checkout.sessions.create(sessionData)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
