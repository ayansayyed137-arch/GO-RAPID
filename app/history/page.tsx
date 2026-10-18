'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RideHistoryPage() {
  const router = useRouter()
  const [rides, setRides] = useState([
    { id: 'GR-9821', pickup: 'Harsul', dropoff: 'Kranti chowk', distance: 8, fare: 152, date: '18 Oct 2026', status: 'Completed' },
    { id: 'GR-5412', pickup: 'Cidco', dropoff: 'Railway Station', distance: 12, fare: 228, date: '15 Oct 2026', status: 'Completed' },
  ])

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
      <header className="px-8 py-5 flex justify-between items-center bg-[#070b14]/90 border-b border-gray-800/80 sticky top-0 z-50">
        <h1 className="text-xl font-extrabold text-[#facc15] tracking-wide uppercase cursor-pointer" onClick={() => router.push('/')}>
          GO RAPID / RIDE HISTORY
        </h1>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
        >
          Back to Dashboard
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center space-x-2">
          <span>📜</span>
          <span>Your Past Rides</span>
        </h2>

        <div className="space-y-4">
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
                  onClick={() => router.push(`/receipt?id=${ride.id}`)}
                  className="flex-1 md:flex-none bg-[#1f2937] hover:bg-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-700 transition-all cursor-pointer"
                >
                  View Receipt
                </button>
                <button
                  onClick={() => router.push(`/review?id=${ride.id}`)}
                  className="flex-1 md:flex-none bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Write Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
