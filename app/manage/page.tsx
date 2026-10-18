'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Ride {
  id: string
  date: string
  pickup: string
  dropoff: string
  distance: number
  fare: number
  status: string
}

export default function ManageRidesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success')

  const [rides, setRides] = useState<Ride[]>([
    {
      id: 'GR-9821',
      date: '18 Oct 2026',
      pickup: 'Harsul',
      dropoff: 'Kranti chowk',
      distance: 8,
      fare: 152,
      status: 'Completed',
    },
    {
      id: 'GR-5412',
      date: '15 Oct 2026',
      pickup: 'Cidco',
      dropoff: 'Railway Station',
      distance: 12,
      fare: 228,
      status: 'Completed',
    },
  ])

  const [activeTab, setActiveTab] = useState<'history' | 'receipt' | 'review'>('history')
  const [selectedRide, setSelectedRide] = useState<Ride>(rides[0])
  const [reviewText, setReviewText] = useState('')

  useEffect(() => {
    // Load saved rides from localStorage if any
    const savedRides = localStorage.getItem('go_rapid_rides')
    if (savedRides) {
      try {
        setRides(JSON.parse(savedRides))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  useEffect(() => {
    // If redirected from successful stripe payment, add a new ride automatically
    if (isSuccess === 'true') {
      const newRideId = `GR-${Math.floor(1000 + Math.random() * 9000)}`
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })

      const newRide: Ride = {
        id: newRideId,
        date: today,
        pickup: 'Kat Kat Gate', // Or fetch from session storage if stored
        dropoff: 'Jafar Gate',
        distance: 10,
        fare: 200,
        status: 'Completed',
      }

      setRides((prev) => {
        // Prevent duplicate addition on reload
        if (prev.some((r) => r.id === newRideId)) return prev
        const updated = [newRide, ...prev]
        localStorage.setItem('go_rapid_rides', JSON.stringify(updated))
        return updated
      })
      setSelectedRide(newRide)
    }
  }, [isSuccess])

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you! Your review has been submitted successfully.')
    setReviewText('')
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-5 flex justify-between items-center bg-[#070b14] sticky top-0 z-50 border-b border-gray-800/50">
        <h1 className="text-xl font-black text-[#facc15] tracking-widest uppercase">
          GO RAPID / RIDE MANAGEMENT
        </h1>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-[#facc15] border border-yellow-500/30 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center space-x-2 ${
              activeTab === 'history'
                ? 'bg-[#facc15] text-black shadow-yellow-500/20'
                : 'bg-[#111827] text-gray-300 border border-gray-800 hover:border-gray-700'
            }`}
          >
            <span>📜 Ride History</span>
          </button>

          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center space-x-2 ${
              activeTab === 'receipt'
                ? 'bg-[#facc15] text-black shadow-yellow-500/20'
                : 'bg-[#111827] text-gray-300 border border-gray-800 hover:border-gray-700'
            }`}
          >
            <span>📄 View Receipt ({selectedRide.id})</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center space-x-2 ${
              activeTab === 'review'
                ? 'bg-[#facc15] text-black shadow-yellow-500/20'
                : 'bg-[#111827] text-gray-300 border border-gray-800 hover:border-gray-700'
            }`}
          >
            <span>⭐ Write Review</span>
          </button>
        </div>

        {/* Tab 1: Ride History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Your Past Rides</h2>

            <div className="space-y-4">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-gray-700"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="bg-[#facc15] text-black font-black text-xs px-2.5 py-1 rounded-lg">
                        {ride.id}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{ride.date}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {ride.status}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-200">
                      <p>🚗 <span className="text-gray-400">From:</span> {ride.pickup}</p>
                      <p className="mt-1">🏁 <span className="text-gray-400">To:</span> {ride.dropoff}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Distance: <span className="text-white font-bold">{ride.distance} KM</span> | Fare:{' '}
                      <span className="text-[#facc15] font-black">₹{ride.fare}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    <button
                      onClick={() => {
                        setSelectedRide(ride)
                        setActiveTab('receipt')
                      }}
                      className="flex-1 md:flex-initial bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs px-4 py-3 rounded-xl border border-gray-700 transition-all cursor-pointer"
                    >
                      View Receipt
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRide(ride)
                        setActiveTab('review')
                      }}
                      className="flex-1 md:flex-initial bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: View Receipt */}
        {activeTab === 'receipt' && (
          <div className="bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl max-w-xl mx-auto space-y-6">
            <div className="text-center border-b border-gray-800 pb-5">
              <h2 className="text-xl font-black text-[#facc15] tracking-widest uppercase">GO RAPID RECEIPT</h2>
              <p className="text-xs text-gray-400 mt-1">Official Payment & Ride Invoice</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-800/60">
                <span className="text-gray-400">Booking ID</span>
                <span className="font-bold text-white">{selectedRide.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/60">
                <span className="text-gray-400">Date</span>
                <span className="font-semibold text-white">{selectedRide.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/60">
                <span className="text-gray-400">Pickup Location</span>
                <span className="font-semibold text-white">{selectedRide.pickup}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/60">
                <span className="text-gray-400">Dropoff Location</span>
                <span className="font-semibold text-white">{selectedRide.dropoff}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800/60">
                <span className="text-gray-400">Total Distance</span>
                <span className="font-semibold text-white">{selectedRide.distance} KM</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold">
                <span className="text-gray-300">Paid Amount (Stripe)</span>
                <span className="text-[#facc15]">₹{selectedRide.fare}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Print / Download Receipt
            </button>
          </div>
        )}

        {/* Tab 3: Write Review */}
        {activeTab === 'review' && (
          <div className="bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-white mb-2">Rate Your Ride ({selectedRide.id})</h2>
            <p className="text-xs text-gray-400 mb-6">
              From {selectedRide.pickup} to {selectedRide.dropoff}
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Your Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your experience about the ride and driver..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-gray-800 focus:border-[#facc15] rounded-xl p-4 text-sm text-white placeholder-gray-600 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer shadow-lg"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  )
}
