'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GoRapidDashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [rideType, setRideType] = useState('GoMini')
  const [bookingStatus, setBookingStatus] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    // Check if user is logged in via localStorage or cookie
    const storedUser = localStorage.getItem('go_rapid_user')
    if (!storedUser) {
      router.push('/login')
    } else {
      setUserEmail(storedUser)
    }
  }, [router])

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) {
      alert('Please enter both pickup and dropoff locations.')
      return
    }

    setIsBooking(true)
    setBookingStatus(null)

    setTimeout(() => {
      setIsBooking(false)
      setBookingStatus(`Cab booked successfully! Your ${rideType} is arriving shortly at ${pickup}.`)
    }, 1500)
  }

  const handleLogout = () => {
    localStorage.removeItem('go_rapid_user')
    document.cookie = 'go_rapid_user=; path=/; max-age=0;'
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-gray-800/80 bg-[#111827]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-black text-[#facc15] tracking-wider uppercase">
            GO RAPID
          </h1>
          <span className="text-xs bg-yellow-500/10 text-[#facc15] border border-yellow-500/30 px-2.5 py-1 rounded-full font-semibold">
            Live Radar Active
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400 hidden sm:inline">
            Logged in as: <strong className="text-white">{userEmail || 'User'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Ride Booking Form */}
        <div className="lg:col-span-1 bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Book Your Ride</h2>
            <p className="text-xs text-gray-400 mb-6">Fast, reliable, and secure cab booking.</p>

            {bookingStatus && (
              <div className="mb-6 p-4 rounded-xl text-xs font-semibold bg-green-950/80 border border-green-700 text-green-200">
                {bookingStatus}
              </div>
            )}

            <form onSubmit={handleBookRide} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Pickup Location
                </label>
                <input
                  type="text"
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup address..."
                  className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  required
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Enter destination..."
                  className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Select Ride Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['GoMini', 'GoSedan', 'GoSUV'].map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setRideType(tier)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        rideType === tier
                          ? 'bg-[#facc15] text-black border-[#facc15] shadow-lg shadow-[#facc15]/10'
                          : 'bg-[#1b2333] text-gray-300 border-gray-700/70 hover:border-gray-500'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-4 cursor-pointer disabled:opacity-50"
              >
                {isBooking ? 'Finding Nearest Driver...' : 'Request GO RAPID'}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800/60 text-center text-xs text-gray-500">
            Secure Stripe Checkout & Live Tracking Enabled
          </div>
        </div>

        {/* Right Column: Live Map Radar / Status View */}
        <div className="lg:col-span-2 bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Live Radar & Fleet View</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-700 rounded-xl bg-[#161f30]/50">
            <div className="w-16 h-16 bg-[#facc15]/10 rounded-full flex items-center justify-center mb-4 text-[#facc15] text-2xl font-bold">
              📍
            </div>
            <h4 className="text-base font-bold text-white mb-1">Leaflet Radar Map Initialized</h4>
            <p className="text-xs text-gray-400 max-w-sm">
              Your live route matching, nearby drivers, and destination coordinates will render here seamlessly.
            </p>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#1b2333]/80 p-3 rounded-xl border border-gray-800">
              <div className="text-xs text-gray-400">Nearby Drivers</div>
              <div className="text-lg font-extrabold text-[#facc15]">14 Active</div>
            </div>
            <div className="bg-[#1b2333]/80 p-3 rounded-xl border border-gray-800">
              <div className="text-xs text-gray-400">Avg. ETA</div>
              <div className="text-lg font-extrabold text-white">3.4 Mins</div>
            </div>
            <div className="bg-[#1b2333]/80 p-3 rounded-xl border border-gray-800">
              <div className="text-xs text-gray-400">Status</div>
              <div className="text-lg font-extrabold text-green-400">Online</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
