import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: Request) {
  try {
    const { pickup, dropoff, email, distanceKm, amount } = await req.json()
    const origin = req.headers.get('origin') || 'https://go-rapid-67nx.vercel.app'

    const distance = Number(distanceKm) > 0 ? Number(distanceKm) : 10
    const calculatedAmount = Number(amount) > 0 ? Number(amount) : (distance * 19)

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Ride Booking (${distance} KM)`,
              description: `From ${pickup || 'Pickup'} to ${dropoff || 'Dropoff'} @ ₹19/KM`,
            },
            unit_amount: Math.round(calculatedAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/manage?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    } as any)

    return NextResponse.json({ url: session.url })
  } caught (err: any) {
    console.error('Stripe Checkout Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
