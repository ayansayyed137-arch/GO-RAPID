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
  rating?: number
  review?: string
}

export default function Home() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [distance, setDistance] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState<Ride[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<Ride | null>(null)
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(5)
  const [reviewText, setReviewText] = useState('')
  
  const supabase = createClient()

  const ratePerKm = 15
  const baseFare = 50
  const calculatedFare = Math.round(baseFare + distance * ratePerKm)

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

  const handleSaveReview = async (rideId: string) => {
    const { error } = await supabase
      .from('rides')
      .update({ rating, review: reviewText })
      .eq('id', rideId)

    if (!error) {
      alert('Review submitted successfully!')
      setActiveReviewId(null)
      fetchRideHistory()
    } else {
      alert('Failed to submit review')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#030712] text-white relative overflow-hidden">
      {/* Background Glow Elements for Glassmorphism depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Side: Map View with Glassmorphism */}
          <div className="bg-gray-900/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-white/5">
              <iframe
                title="Aurangabad Map"
                className="w-full h-full border-0 filter contrast-125 invert hue-rotate-180 opacity-80"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15008.204561021462!2d75.3239!3d19.8762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdba29283e351eb%3A0x86134b3f88d227d8!2sChhatrapati%20Sambhajinagar%20(Aurangabad)!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              ></iframe>
            </div>
          </div>

          {/* Right Side: Booking Form with Glassmorphism */}
          <div className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <span>🚗</span> Book & Pay via Distance
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g., Kat Kat Gate"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Dropoff Location</label>
                <input
                  type="text"
                  placeholder="e.g., Jafar Gate"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
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
                  className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                />
              </div>

              {/* Price Box with Glassmorphism */}
              <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/5 space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Base Fare</span>
                  <span>₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Distance ({distance} KM × ₹15)</span>
                  <span>₹{distance * ratePerKm}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-base font-bold text-yellow-400">
                  <span>Total Fare</span>
                  <span>₹{calculatedFare}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50"
              >
                <span>💳</span>
                <span>{loading ? 'Processing...' : `Pay ₹${calculatedFare} with Stripe`}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Ride History Section with Glassmorphism */}
        <div className="mt-8 bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-yellow-400">Your Ride History & Receipts</h3>
            <button
              onClick={fetchRideHistory}
              className="bg-white/5 hover:bg-white/10 text-xs px-3.5 py-2 rounded-xl border border-white/10 text-gray-300 transition flex items-center gap-1.5 backdrop-blur-md"
            >
              🔄 Refresh
            </button>
          </div>

          {rides.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No recent rides found.</p>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 space-y-3 hover:border-white/20 transition"
                >
                  <div className="flex justify-between items-center">
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
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full border border-green-500/30">
                        {ride.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedReceipt(ride)}
                      className="text-xs bg-white/5 hover:bg-white/10 text-yellow-400 px-3 py-1.5 rounded-xl border border-white/10 transition flex items-center gap-1.5 backdrop-blur-md"
                    >
                      <span>📄</span> View Receipt
                    </button>
                    <button
                      onClick={() => {
                        setActiveReviewId(activeReviewId === ride.id ? null : ride.id)
                        setRating(ride.rating || 5)
                        setReviewText(ride.review || '')
                      }}
                      className="text-xs bg-white/5 hover:bg-white/10 text-gray-200 px-3 py-1.5 rounded-xl border border-white/10 transition flex items-center gap-1.5 backdrop-blur-md"
                    >
                      <span>⭐</span> {ride.rating ? `Rated (${ride.rating}/5)` : 'Rate Ride'}
                    </button>
                  </div>

                  {activeReviewId === ride.id && (
                    <div className="mt-3 p-3 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Write a review (e.g., Smooth ride!)"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                      <button
                        onClick={() => handleSaveReview(ride.id)}
                        className="bg-yellow-400 text-black text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-500 transition"
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Receipt Modal with Glassmorphism */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white p-6 rounded-3xl max-w-sm w-full space-y-4 border border-white/10 shadow-2xl relative">
            <div className="text-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-yellow-400">GO RAPID RECEIPT</h3>
              <p className="text-xs text-gray-400">Official Ride Invoice</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Ride ID:</span> <span className="font-mono text-xs">{selectedReceipt.id.slice(0, 8)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Pickup:</span> <span className="font-semibold">{selectedReceipt.pickup}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Dropoff:</span> <span className="font-semibold">{selectedReceipt.dropoff}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Distance:</span> <span>{selectedReceipt.distance} KM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date:</span> <span>{new Date(selectedReceipt.created_at).toLocaleString()}</span></div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
                <span>Total Paid:</span>
                <span className="text-green-400">₹{selectedReceipt.amount}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full bg-yellow-400 text-black text-xs font-bold py-2.5 rounded-xl hover:bg-yellow-500 transition"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full bg-white/10 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-white/20 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
