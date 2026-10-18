'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GoRapidDashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [distance, setDistance] = useState<number | string>(10)
  const [isProcessing, setIsProcessing] = useState(false)

  // Rate settings
  const RATE_PER_KM = 19
  const BASE_FARE = 50

  const numericDistance = Number(distance) || 0
  const distanceFare = numericDistance * RATE_PER_KM
  const totalFare = numericDistance > 0 ? BASE_FARE + distanceFare : 0

  useEffect(() => {
    const storedUser = localStorage.getItem('go_rapid_user')
    if (storedUser) {
      setUserEmail(storedUser)
    }
  }, [])

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) {
      alert('Please enter both pickup and dropoff locations.')
      return
    }
    if (numericDistance <= 0) {
      alert('Please enter a valid distance in KM.')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup,
          dropoff,
          email: userEmail || 'customer@gorapid.com',
          distanceKm: numericDistance,
          amount: totalFare,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create Stripe payment session.')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error connecting to Stripe checkout gateway.')
      setIsProcessing(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('go_rapid_user')
    document.cookie = 'go_rapid_user=; path=/; max-age=0;'
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-8 py-5 flex justify-between items-center bg-[#070b14]/90 sticky top-0 z-50">
        <h1 className="text-xl font-extrabold text-[#facc15] tracking-wide uppercase">
          GO RAPID
        </h1>
        <button
          onClick={handleSignOut}
          className="bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-md"
        >
          Sign Out
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Dark Map Embed Container */}
          <div className="bg-[#111827]/80 border border-gray-800/80 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col min-h-[480px]">
            <div className="relative flex-1 rounded-xl overflow-hidden border border-gray-800 bg-[#0c101d] flex flex-col">
              
              {/* Map Dark Iframe */}
              <iframe
                title="Chhatrapati Sambhajinagar Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=75.25%2C19.83%2C75.42%2C19.95&amp;layer=mapnik"
                className="w-full h-full border-0 flex-1 filter invert hue-rotate-180 contrast-125 brightness-90"
                style={{ minHeight: '400px' }}
              />

              {/* Map Floating Card Overlay (Top Left) */}
              <div className="absolute top-4 left-4 z-20 bg-[#0f172a]/90 backdrop-blur-md border border-gray-700/60 rounded-xl p-3 shadow-xl max-w-[240px]">
                <h4 className="text-xs font-bold text-white">Chhatrapati Sambhajinagar</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Chhatrapati Sambhajinagar, Maharashtra</p>
                <a
                  href="https://maps.google.com/?q=Chhatrapati+Sambhajinagar"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center space-x-1.5 bg-[#38bdf8] hover:bg-[#0284c7] text-black font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Open in Maps</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Book & Pay via Distance Form */}
          <div className="bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-xl">🚗</span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Book & Pay via Distance
                </h2>
              </div>

              <form onSubmit={handleStripeCheckout} className="space-y-5">
                {/* Pickup Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kat Kat Gate"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-all"
                  />
                </div>

                {/* Dropoff Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jafar Gate"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-all"
                  />
                </div>

                {/* Distance Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-gray-400">
                      Estimated Distance (KM)
                    </label>
                    <span className="text-xs font-bold text-[#facc15]">
                      Rate: ₹{RATE_PER_KM}/km
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-all"
                  />
                </div>

                {/* Fare Summary Box */}
                <div className="bg-[#0b0f19]/80 border border-gray-800/80 rounded-xl p-4 space-y-2 mt-6">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Base Fare</span>
                    <span className="text-gray-300">₹{BASE_FARE}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Distance ({numericDistance} KM × ₹{RATE_PER_KM})</span>
                    <span className="text-gray-300">₹{distanceFare}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-2 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Fare</span>
                    <span className="text-lg text-[#facc15]">₹{totalFare}</span>
                  </div>
                </div>

                {/* Yellow Stripe Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-6"
                >
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                  <span>
                    {isProcessing ? 'Processing Payment...' : `Pay ₹${totalFare} with Stripe`}
                  </span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
