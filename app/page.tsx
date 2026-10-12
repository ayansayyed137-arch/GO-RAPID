'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function Home() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState<any[]>([])
  const [selectedRide, setSelectedRide] = useState<any>(null)
  
  // Rating & Review State
  const [ratingRide, setRatingRide] = useState<any>(null)
  const [starCount, setStarCount] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    fetchRides()

    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      alert('Stripe Payment Successful! Ride booked.')
      window.history.replaceState({}, document.title, '/')
    }
  }, [])

  const fetchRides = async () => {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRides(data)
    }
  }

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) return alert('Please enter pickup and dropoff locations')

    setLoading(true)

    try {
      await supabase.from('rides').insert([
        {
          pickup_location: pickup,
          dropoff_location: dropoff,
          status: 'Completed',
          user_id: 'user_go_rapid_local',
        },
      ])

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error initiating Stripe checkout: ' + data.error)
        setLoading(false)
      }
    } catch (err: any) {
      alert('Something went wrong: ' + err.message)
      setLoading(false)
    }
  }

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ratingRide) return

    setSubmittingRating(true)

    const { error } = await supabase
      .from('rides')
      .update({
        rating: starCount,
        review: reviewComment,
      })
      .eq('id', ratingRide.id)

    setSubmittingRating(false)

    if (error) {
      alert('Error saving rating: ' + error.message)
    } else {
      alert('Thank you for rating your driver!')
      setRatingRide(null)
      setReviewComment('')
      fetchRides()
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 md:p-12 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">GO RAPID</h1>
        <span className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-sm">
          🔒 Stripe Live Sandbox
          <a 
  href="/login" 
  className="ml-4 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold text-sm rounded-lg hover:bg-yellow-500 transition shadow-md"
>
  Sign In
</a>
        </span>
      </div>

      {/* Main Grid: Satellite Map & Booking */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Satellite Map Section - Aurangabad */}
        <div className="w-full bg-[#0e1626] border border-slate-800 rounded-2xl overflow-hidden shadow-xl min-h-[300px] sm:min-h-[350px] relative flex flex-col transition-all duration-300 hover:border-slate-700">
          <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
            <span>🛰️</span> Aurangabad Navigation View
          </div>
          <iframe
            title="Aurangabad Satellite Map"
            className="w-full h-full min-h-[300px] sm:min-h-[350px] border-0 filter brightness-90 contrast-125"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60155.17646199342!2d75.3045618!3d19.8761653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdbb810744795fb%3A0x9d54e19d555811c7!2sChhatrapati%20Sambhajinagar%20(Aurangabad)%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>

        {/* Booking & Stripe Checkout Form Card */}
        <div className="w-full bg-[#0e1626] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Book & Pay via Stripe</h2>

            <form onSubmit={handleStripeCheckout} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g., Kat Kat Gate"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Dropoff Location</label>
                <input
                  type="text"
                  placeholder="e.g., Jafar Gate"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 active:scale-[0.99] text-slate-950 font-black rounded-xl transition-all shadow-lg cursor-pointer mt-2 text-sm flex items-center justify-center gap-2"
              >
                <span>💳</span> {loading ? 'Redirecting to Stripe...' : 'Pay ₹250 with Stripe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ride History Section */}
      <div className="w-full max-w-4xl bg-[#0e1626] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-amber-400">Your Ride History</h3>
          <button
            onClick={fetchRides}
            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg transition cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>

        {rides.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No past rides found. Book your first ride above!</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-[#070b14] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-700"
              >
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ride.status || 'Completed'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ID: #{ride.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">
                    {ride.pickup_location} ➔ {ride.dropoff_location}
                  </p>

                  {ride.rating ? (
                    <div className="text-xs text-amber-400 mt-1 flex items-center gap-1 font-medium">
                      <span>{'⭐'.repeat(ride.rating)}</span>
                      {ride.review && <span className="text-slate-400 italic font-normal">"{ride.review}"</span>}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 mt-0.5">Not rated yet</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {!ride.rating && (
                    <button
                      onClick={() => {
                        setRatingRide(ride)
                        setStarCount(5)
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
                    >
                      ⭐ Rate Driver
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedRide(ride)}
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg cursor-pointer"
                  >
                    📄 Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating & Review Modal Popup */}
      {ratingRide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0e1626] border border-slate-800 p-6 rounded-2xl w-[90%] max-w-md text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-amber-400 mb-2 text-center">Rate Your Driver</h3>
            <p className="text-xs text-slate-400 text-center mb-6">
              Ride: {ratingRide.pickup_location} ➔ {ratingRide.dropoff_location}
            </p>

            <form onSubmit={handleRatingSubmit} className="flex flex-col gap-4">
              <div className="flex justify-center gap-2 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setStarCount(star)}
                    className={`text-3xl transition transform hover:scale-110 cursor-pointer ${
                      star <= starCount ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Write a Review (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Great driver, clean car, smooth ride..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                ></textarea>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="w-1/2 py-2.5 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition shadow"
                >
                  {submittingRating ? 'Saving...' : 'Submit Rating'}
                </button>
                <button
                  type="button"
                  onClick={() => setRatingRide(null)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-medium rounded-xl text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal Popup */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0e1626] border border-slate-800 p-6 rounded-2xl w-[90%] max-w-md text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-4 bg-[#070b14] p-6 rounded-xl border border-slate-800">
              <div className="text-center border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-black text-amber-400">GO RAPID</h2>
                <p className="text-xs text-slate-400">Official Ride Receipt</p>
              </div>

              <div className="flex flex-col gap-2.5 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking ID:</span>
                  <span className="font-mono text-xs text-amber-300">#{selectedRide.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup:</span>
                  <span className="font-medium text-white text-right">{selectedRide.pickup_location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dropoff:</span>
                  <span className="font-medium text-white text-right">{selectedRide.dropoff_location}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center font-bold text-lg">
                <span>Total Paid:</span>
                <span className="text-emerald-400">₹250</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold transition cursor-pointer text-xs shadow"
              >
                Print / PDF
              </button>
              <button
                onClick={() => setSelectedRide(null)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-medium transition cursor-pointer text-xs"
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
