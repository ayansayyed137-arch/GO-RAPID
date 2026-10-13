'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/client'

interface Ride {
  id: string
  pickup: string
  dropoff: string
  distance: number
  amount: number
  created_at: string
  status: string
}

export default function Home() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [distance, setDistance] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState<Ride[]>([])
  const supabase = createClient()

  // Base rate calculation
  const ratePerKm = 15
  const baseFare = 50
  const calculatedFare = Math.round(baseFare + distance * ratePerKm)

  // Fetch Ride History from Supabase
  const fetchRideHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRides(data)
    }
  }

  useEffect(() => {
    fetchRideHistory()
  }, [])

  const handleCheckout = async () => {
    if (!pickup || !dropoff) {
      alert('Kripya Pickup aur Dropoff location bharein!')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Kripya pehle Sign In karein!')
        setLoading(false)
        return
      }

      // Save Ride Details to Supabase First
      const { error: dbError } = await supabase.from('rides').insert([
        {
          user_id: user.id,
          pickup,
          dropoff,
          distance,
          amount: calculatedFare,
          status: 'Pending',
        },
      ])

      if (dbError) {
        console.error('Database Error:', dbError)
      }

      // Proceed to Stripe Payment
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          dropoff,
          distance,
          amount: calculatedFare,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed')
      }
    } catch (err) {
      alert('Error initiating checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Side: Map View */}
          <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="relative w-full h-[380px] rounded-xl overflow-hidden">
              <iframe
                title="Aurangabad Map"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15008.204561021462!2d75.3239!3d19.8762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdba29283e351eb%3A0x86134b3f88d227d8!2sChhatrapati%20Sambhajinagar%20(Aurangabad)!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              ></iframe>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Book & Pay via Distance</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g., Kat Kat Gate"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Dropoff Location</label>
                <input
                  type="text"
                  placeholder="e.g., Jafar Gate"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-400">Estimated Distance (KM)</label>
                  <span className="text-xs text-yellow-400 font-bold">Rate: ₹15/km</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="bg-[#1f2937]/50 p-4 rounded-xl border border-gray-800 space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Base Fare</span>
                  <span>₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Distance ({distance} KM × ₹15)</span>
                  <span>₹{distance * ratePerKm}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-base font-bold text-yellow-400">
                  <span>Total Fare</span>
                  <span>₹{calculatedFare}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <span>💳</span>
                <span>{loading ? 'Processing...' : `Pay ₹${calculatedFare} with Stripe`}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Ride History Section */}
        <div className="mt-8 bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-yellow-400">Your Ride History</h3>
            <button
              onClick={fetchRideHistory}
              className="bg-gray-800 text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700 transition"
            >
              🔄 Refresh
            </button>
          </div>

          {rides.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No recent rides found.</p>
          ) : (
            <div className="space-y-3">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="flex justify-between items-center p-4 bg-[#1f2937] rounded-xl border border-gray-800"
                >
                  <div>
                    <p className="font-semibold text-sm text-white">
                      {ride.pickup} ➔ {ride.dropoff}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Distance: {ride.distance} KM • {new Date(ride.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">₹{ride.amount}</p>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
