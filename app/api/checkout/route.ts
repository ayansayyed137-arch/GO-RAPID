import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build')

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    
    // Read dynamic amount passed from frontend body (e.g., 170)
    // Agar amount pass nahi hota tabhi fallback 250 rahega
    const amountInRupees = body?.amount ?? 250
    const unitAmount = Math.round(Number(amountInRupees) * 100) // Convert INR to Paise for Stripe

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Ride Booking (${body.distance || 0} KM)`,
              description: `From ${body.pickup || 'Pickup'} to ${body.dropoff || 'Dropoff'}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
    })

    return Response.json({ url: session.url })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
