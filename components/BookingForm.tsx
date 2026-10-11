'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function BookingForm() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [fare, setFare] = useState(0)

  // Step 1: Calculate fare and move to simulated payment view
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) {
      setMessage('Please fill in both locations.')
      return
    }
    // Random fare calculation based on length for realism
    const calculatedFare = Math.floor(Math.random() * 200) + 150
    setFare(calculatedFare)
    setMessage('')
    setStep('payment')
  }

  // Step 2: Simulate successful payment and save to Supabase
  const handleSimulatedPayment = async () => {
    setLoading(true)
    setMessage('Processing secure payment...')

    // Simulate gateway delay
    setTimeout(async () => {
      const { error } = await supabase.from('rides').insert([
        {
          user_id: 'guest_user',
          pickup_location: pickup,
          dropoff_location: dropoff,
          status: 'paid',
        },
      ])

      setLoading(false)

      if (error) {
        setMessage('Error booking ride: ' + error.message)
        setStep('form')
      } else {
        setMessage('Payment successful! Ride confirmed & Driver on the way.')
        setPickup('')
        setDropoff('')
        setStep('form')
      }
    }, 1500)
  }

  return (
    <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
      {step === 'form' ? (
        <form onSubmit={handleProceedToPayment} className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-amber-400">Book a Ride</h3>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pickup Location</label>
            <input
              type="text"
              placeholder="Enter pickup location..."
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dropoff Location</label>
            <input
              type="text"
              placeholder="Enter dropoff location..."
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition mt-2"
          >
            Continue to Payment
          </button>
          {message && <p className="text-sm text-center mt-2 text-amber-300">{message}</p>}
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-amber-400">Simulated Checkout</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Route:</span>
              <span className="font-semibold text-white">{pickup} ➔ {dropoff}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Estimated Fare:</span>
              <span className="font-bold text-emerald-400">₹{fare}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-1/2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
            >
              Back
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSimulatedPayment}
              className="w-1/2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${fare}`}
            </button>
          </div>
          {message && <p className="text-sm text-center mt-2 text-amber-300">{message}</p>}
        </div>
      )}
    </div>
  )
}