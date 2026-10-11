import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    
    if (!body || !body.pickup || !body.dropoff) {
      return NextResponse.json(
        { error: 'Pickup and dropoff locations are required' },
        { status: 400 }
      )
    }

    const { pickup, dropoff } = body

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `GO RAPID Ride: ${pickup} to ${dropoff}`,
            },
            unit_amount: 25000, // ₹250.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong with Stripe' },
      { status: 500 }
    )
  }
}