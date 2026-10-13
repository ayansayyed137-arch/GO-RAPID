import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build')

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    
    // Yahan aapka baki checkout logic aayega (e.g. checkout session creation)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Ride Booking',
            },
            unit_amount: 10000, // 100 INR
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
