'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const [viewMode, setViewMode] = useState<'dashboard' | 'history'>('dashboard')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [distance, setDistance] = useState(10)
  const [rides, setRides] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const userEmail = isLoaded && user?.primaryEmailAddress?.emailAddress 
    ? user.primaryEmailAddress.emailAddress 
    : 'guest_user'

  const ratePerKm = 15
  const baseFare = 50
  const totalFare = baseFare + distance * ratePerKm

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load Leaflet Map dynamically
  useEffect(() => {
    if (viewMode === 'dashboard' && isMounted) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => {
        const L = (window as any).L
        if (L && document.getElementById('map-container')) {
          const mapContainer = document.getElementById('map-container')
          if (mapContainer && (mapContainer as any)._leaflet_id) {
            return
          }

          const map = L.map('map-container').setView([19.8762, 75.3433], 13)

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map)

          L.marker([19.8762, 75.3433])
            .addTo(map)
            .bindPopup('Chhatrapati Sambhajinagar Center')
            .openPopup()
        }
      }
      document.body.appendChild(script)
    }
  }, [viewMode, isMounted])

  // Load user-specific rides from localStorage
  useEffect(() => {
    if (!isMounted || !userEmail) return
    const storageKey = `go_rapid_rides_${userEmail}`
    const saved = localStorage.getItem(storageKey)
    
    if (saved) {
      setRides(JSON.parse(saved))
    } else {
      setRides([])
    }
  }, [userEmail, isMounted])

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations.')
      return
    }

    setIsLoading(true)

    const randomId = 'GR-' + Math.floor(1000 + Math.random() * 9000)
    const newRide = {
      id: randomId,
      date: '19 Oct 2026',
      status: 'Completed',
      from: pickup,
      to: dropoff,
      distance: distance + ' KM',
      fare: '₹' + totalFare,
    }

    const updated = [newRide, ...rides]
    setRides(updated)
    
    const storageKey = `go_rapid_rides_${userEmail}`
    localStorage.setItem(storageKey, JSON.stringify(updated))

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff, amount: totalFare, rideId: randomId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setIsLoading(false)
        alert(`Ride successfully booked! ID: ${randomId}`)
        setViewMode('history')
      }
    } catch (err) {
      setIsLoading(false)
      alert(`Ride successfully booked! ID: ${randomId}`)
      setViewMode('history')
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-yellow-400 font-bold">
        Loading GoRapid...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Mobile & Desktop Responsive Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 bg-[#111827]/60 p-4 rounded-2xl border border-gray-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#facc15] tracking-widest uppercase">
              GO RAPID
            </h1>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px] sm:max-w-none">
              Logged in as: <span className="text-[#facc15] font-semibold">{userEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setViewMode(viewMode === 'dashboard' ? 'history' : 'dashboard')}
              className="flex-1 sm:flex-none bg-[#1f2937] hover:bg-gray-800 text-yellow-400 border border-gray-700 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-center shadow-lg"
            >
              {viewMode === 'dashboard' ? '📜 Rides & History' : '🗺️ Back to Map'}
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold px-4 sm:px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shrink-0"
            >
              Sign Out
            </button>
          </div>
        </div>

        {viewMode === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Left: Responsive Interactive Map */}
            <div className="bg-[#111827]/90 border border-gray-800 rounded-2xl overflow-hidden h-[380px] sm:h-[550px] shadow-2xl relative">
              <div className="absolute top-3 left-3 z-[1000] bg-[#111827]/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-gray-800 text-[11px] sm:text-xs font-semibold shadow-lg text-white max-w-[85%] truncate">
                📍 Chhatrapati Sambhajinagar
              </div>
              <div id="map-container" className="w-full h-full z-0 bg-[#0b0f19]"></div>
            </div>

            {/* Right: Booking Form with Stripe */}
            <div className="bg-[#111827]/90 border border-gray-800 rounded-2xl p-5 sm:p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <span>💳</span> Book & Pay via Stripe
                </h2>

                <form onSubmit={handleStripePayment} className="space-y-4 sm:space-y-5">
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
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15]"
                    />
                  </div>

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
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-medium text-gray-400">
                        Estimated Distance (KM)
                      </label>
                      <span className="text-xs text-[#facc15] font-semibold">Rate: ₹{ratePerKm}/km</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#facc15]"
                    />
                  </div>

                  <div className="bg-[#0b0f19] border border-gray-800/80 rounded-xl p-4 space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Base Fare</span>
                      <span className="text-white">₹{baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance ({distance} KM × ₹{ratePerKm})</span>
                      <span className="text-white">₹{distance * ratePerKm}</span>
                    </div>
                    <div className="border-t border-gray-800 pt-2 flex justify-between text-sm font-bold text-white">
                      <span>Total Fare</span>
                      <span className="text-[#facc15]">₹{totalFare}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 sm:py-4 rounded-xl shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Processing Stripe Checkout...' : `Pay with Stripe & Book (₹{totalFare})`}
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* User Isolated Ride History View */
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-200">
              Your Past Rides (<span className="text-[#facc15]">{userEmail}</span>)
            </h2>
            {rides.length === 0 ? (
              <p className="text-sm text-gray-400 bg-[#111827] p-8 rounded-2xl border border-gray-800 text-center">
                Is account par abhi tak koi past ride nahi hai. Nayi ride book karein!
              </p>
            ) : (
              <div className="space-y-4">
                {rides.map((ride, index) => (
                  <div
                    key={index}
                    className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#facc15] text-black font-black px-3 py-1 rounded-lg text-xs">
                          {ride.id}
                        </span>
                        <span className="text-xs text-gray-400">{ride.date}</span>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {ride.status}
                        </span>
                      </div>
                      <div className="text-sm space-y-1 text-gray-300">
                        <p><span className="text-red-400">🚗 From:</span> {ride.from || 'N/A'}</p>
                        <p><span className="text-gray-400">🏁 To:</span> {ride.to || 'N/A'}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Distance: <span className="text-white">{ride.distance}</span> | Fare: <span className="text-[#facc15]">{ride.fare}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
