'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ManageRidesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'history' | 'receipt' | 'review'>('history')
  const [selectedRideId, setSelectedRideId] = useState('GR-9821')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Dummy rides data
  const rides = [
    { id: 'GR-9821', pickup: 'Harsul', dropoff: 'Kranti chowk', distance: 8, fare: 152, date: '18 Oct 2026', status: 'Completed' },
    { id: 'GR-5412', pickup: 'Cidco', dropoff: 'Railway Station', distance: 12, fare: 228, date: '15 Oct 2026', status: 'Completed' },
  ]

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setReviewSubmitted(true)
    setTimeout(() => {
      setReviewSubmitted(false)
      setActiveTab('history')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-8 py-5 flex justify-between items-center bg-[#070b14]/90 border-b border-gray-800/85 sticky top-0 z-50">
        <h1 className="text-xl font-extrabold text-[#facc15] tracking-wide uppercase cursor-pointer" onClick={() => router.push('/')}>
          GO RAPID / RIDE MANAGEMENT
        </h1>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-4xl w-full mx-auto px-6 mt-6 flex space-x-3 border-b border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === 'history' ? 'bg-[#facc15] text-black shadow-lg' : 'bg-[#111827] text-gray-400 hover:text-white'}`}
        >
          📜 Ride History
        </button>
        <button
          onClick={() => setActiveTab('receipt')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === 'receipt' ? 'bg-[#facc15] text-black shadow-lg' : 'bg-[#111827] text-gray-400 hover:text-white'}`}
        >
          📄 View Receipt ({selectedRideId})
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === 'review' ? 'bg-[#facc15] text-black shadow-lg' : 'bg-[#111827] text-gray-400 hover:text-white'}`}
        >
          ⭐ Write Review
        </button>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        
        {/* TAB 1: RIDE HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg font-bold text-white mb-4">Your Past Rides</h2>
            {rides.map((ride) => (
              <div key={ride.id} className="bg-[#111827]/90 border border-gray-800/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-[#facc15] bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/20">{ride.id}</span>
                    <span className="text-xs text-gray-400">{ride.date}</span>
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-semibold">{ride.status}</span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><strong className="text-gray-400">From:</strong> {ride.pickup}</p>
                    <p><strong className="text-gray-400">To:</strong> {ride.dropoff}</p>
                    <p className="text-xs text-gray-400">Distance: {ride.distance} KM | Fare: <strong className="text-[#facc15]">₹{ride.fare}</strong></p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={() => { setSelectedRideId(ride.id); setActiveTab('receipt'); }}
                    className="flex-1 md:flex-none bg-[#1f2937] hover:bg-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-700 transition-all cursor-pointer"
                  >
                    View Receipt
                  </button>
                  <button
                    onClick={() => { setSelectedRideId(ride.id); setActiveTab('review'); }}
                    className="flex-1 md:flex-none bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Write Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: VIEW RECEIPT */}
        {activeTab === 'receipt' && (
          <div className="max-w-xl mx-auto bg-[#111827]/90 border border-gray-800/80 rounded-2xl p-8 shadow-2xl space-y-6 animate-fadeIn">
            <div className="text-center pb-6 border-b border-gray-800">
              <h2 className="text-xl font-black text-[#facc15]">GO RAPID DIGITAL INVOICE</h2>
              <p className="text-xs text-gray-400 mt-1">Booking Reference: {selectedRideId}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Payment Gateway</span><span className="text-green-400 font-bold">Paid via Stripe (Card)</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Pickup Location</span><span className="font-semibold">Harsul</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Dropoff Location</span><span className="font-semibold">Kranti chowk</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Distance Travelled</span><span className="font-semibold">8 KM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Rate Applied</span><span className="font-semibold">₹19 / KM</span></div>
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-2">
              <div className="flex justify-between text-base font-bold">
                <span>Total Amount Paid</span>
                <span className="text-[#facc15] text-xl">₹152.00</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              Print / Download Receipt
            </button>
          </div>
        )}

        {/* TAB 3: WRITE REVIEW */}
        {activeTab === 'review' && (
          <div className="max-w-xl mx-auto bg-[#111827]/90 border border-gray-800/80 rounded-2xl p-8 shadow-2xl animate-fadeIn">
            {reviewSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <span className="text-4xl">⭐</span>
                <h3 className="text-lg font-bold text-green-400">Review submitted successfully!</h3>
                <p className="text-xs text-gray-400">Returning to ride history...</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Rate trip ({selectedRideId})</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Share your feedback about the ride</p>
                </div>

                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl cursor-pointer transition-transform hover:scale-110 ${star <= rating ? 'text-[#facc15]' : 'text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Comments</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
