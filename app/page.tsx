'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  
  const [viewMode, setViewMode] = useState<'dashboard' | 'history'>('dashboard')
  const [pickup, setPickup] = useState('Kat Kat Gate')
  const [dropoff, setDropoff] = useState('Azad Chowk')
  const [distance, setDistance] = useState(5)
  const [rides, setRides] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('sayyedayan@gmail.com')

  // Modals state for Receipt & Review
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [selectedReviewRide, setSelectedReviewRide] = useState<any>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const mapRef = useRef<any>(null)
  const routingControlRef = useRef<any>(null)

  const totalFare = 50 + distance * 15

  // Get user session from localStorage or default
  useEffect(() => {
    const savedUser = localStorage.getItem('go_rapid_user')
    if (savedUser) {
      setUserEmail(savedUser)
    } else {
      const email = prompt('Enter your email or username to continue:') || 'sayyedayan@gmail.com'
      localStorage.setItem('go_rapid_user', email)
      setUserEmail(email)
    }
  }, [])

  // Load Leaflet and Leaflet Routing Machine dynamically via CDN
  useEffect(() => {
    if (viewMode === 'dashboard') {
      const leafletCSS = document.createElement('link')
      leafletCSS.rel = 'stylesheet'
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(leafletCSS)

      const routingCSS = document.createElement('link')
      routingCSS.rel = 'stylesheet'
      routingCSS.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css'
      document.head.appendChild(routingCSS)

      const leafletScript = document.createElement('script')
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      leafletScript.async = true
      leafletScript.onload = () => {
        const routingScript = document.createElement('script')
        routingScript.src = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js'
        routingScript.async = true
        routingScript.onload = () => {
          const L = (window as any).L
          if (L && document.getElementById('map-container')) {
            const mapContainer = document.getElementById('map-container')
            if (mapContainer && (mapContainer as any)._leaflet_id) {
              return
            }

            const map = L.map('map-container').setView([19.8762, 75.3433], 14)
            mapRef.current = map

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19,
            }).addTo(map)

            const routingControl = L.Routing.control({
              waypoints: [
                L.latLng(19.8762, 75.3433),
                L.latLng(19.8900, 75.3600)
              ],
              routeWhileDragging: false,
              addWaypoints: false,
              draggableWaypoints: false,
              fitSelectedRoutes: true,
              showAlternatives: false,
              lineOptions: {
                styles: [{ color: '#facc15', weight: 6, opacity: 0.9 }]
              },
              createMarker: function(i: number, waypoint: any) {
                const markerTitle = i === 0 ? `Pickup: ${pickup}` : `Dropoff: ${dropoff}`
                return L.marker(waypoint.latLng).bindPopup(markerTitle)
              }
            }).addTo(map)

            const container = routingControl.getContainer()
            if (container) {
              container.style.display = 'none'
            }

            routingControlRef.current = routingControl
          }
        }
        document.body.appendChild(routingScript)
      }
      document.body.appendChild(leafletScript)
    }
  }, [viewMode])

  useEffect(() => {
    const L = (window as any).L
    if (L && routingControlRef.current) {
      const localOffset = (distance || 5) * 0.0015
      const startLatLng = L.latLng(19.8762, 75.3433)
      const endLatLng = L.latLng(19.8762 + localOffset, 75.3433 + localOffset)

      routingControlRef.current.setWaypoints([startLatLng, endLatLng])
    }
  }, [pickup, dropoff, distance])

  // Load user-specific rides from localStorage
  useEffect(() => {
    if (!userEmail) return
    const storageKey = `go_rapid_rides_${userEmail}`
    const saved = localStorage.getItem(storageKey)
    
    if (saved) {
      setRides(JSON.parse(saved))
    } else {
      setRides([])
    }
  }, [userEmail])

  // Clear history handler
  const handleClearHistory = () => {
    if (confirm('Kya aap saari ride history clear karna chahte hain?')) {
      const storageKey = `go_rapid_rides_${userEmail}`
      localStorage.removeItem(storageKey)
      setRides([])
    }
  }

  // Submit Review Handler
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReviewRide) return

    const updatedRides = rides.map((r) => {
      if (r.id === selectedReviewRide.id) {
        return {
          ...r,
          review: {
            rating: reviewRating,
            text: reviewText || 'Great ride experience!',
          },
        }
      }
      return r
    })

    setRides(updatedRides)
    const storageKey = `go_rapid_rides_${userEmail}`
    localStorage.setItem(storageKey, JSON.stringify(updatedRides))

    setSelectedReviewRide(null)
    setReviewText('')
    setReviewRating(5)
    alert('Review submitted successfully!')
  }

  // Stripe Payment & Ride Creation
  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) {
      alert('Kripya pickup aur dropoff locations dalein.')
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
      distanceNum: distance,
      baseFare: 50,
      distanceFare: distance * 15,
      fare: '₹' + totalFare,
      fareNum: totalFare,
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, dropoff, amount: totalFare, rideId: randomId }),
      })
      const data = await res.json()
      
      const updated = [newRide, ...rides]
      setRides(updated)
      const storageKey = `go_rapid_rides_${userEmail}`
      localStorage.setItem(storageKey, JSON.stringify(updated))

      if (data.url) {
        window.location.href = data.url
      } else {
        setIsLoading(false)
        alert(`Ride booked successfully! ID: ${randomId}`)
        setViewMode('history')
      }
    } catch (err) {
      setIsLoading(false)
      const updated = [newRide, ...rides]
      setRides(updated)
      const storageKey = `go_rapid_rides_${userEmail}`
      localStorage.setItem(storageKey, JSON.stringify(updated))
      
      alert(`Ride booked successfully! ID: ${randomId}`)
      setViewMode('history')
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('go_rapid_user')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
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
              onClick={handleSignOut}
              className="bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold px-4 sm:px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shrink-0"
            >
              Sign Out
            </button>
          </div>
        </div>

        {viewMode === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Map Container */}
            <div className="bg-[#111827]/90 border border-gray-800 rounded-2xl overflow-hidden h-[380px] sm:h-[550px] shadow-2xl relative">
              <div className="absolute top-3 left-3 z-[1000] bg-[#111827]/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-gray-800 text-[11px] sm:text-xs font-semibold shadow-lg text-white max-w-[85%] truncate">
                📍 Chhatrapati Sambhajinagar Local Route
              </div>
              <div id="map-container" className="w-full h-full z-0 bg-[#0b0f19]"></div>
            </div>

            {/* Booking Form */}
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
                      placeholder="e.g., Azad Chowk"
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
                      <span className="text-xs text-[#facc15] font-semibold">Rate: ₹15/km</span>
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
                      <span className="text-white">₹50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance ({distance} KM × ₹15)</span>
                      <span className="text-white">₹{distance * 15}</span>
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
                    {isLoading ? 'Redirecting to Stripe...' : `Pay with Stripe & Book (₹${totalFare})`}
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* Ride History View with View Receipt & Write Review buttons */
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-200">
                Your Past Rides (<span className="text-[#facc15]">{userEmail}</span>)
              </h2>
              {rides.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  🗑️ Clear History
                </button>
              )}
            </div>

            {rides.length === 0 ? (
              <p className="text-sm text-gray-400 bg-[#111827] p-8 rounded-2xl border border-gray-800 text-center">
                Is account par abhi tak koi past ride nahi hai. Nayi ride book karein!
              </p>
            ) : (
              <div className="space-y-4">
                {rides.map((ride, index) => (
                  <div
                    key={index}
                    className="bg-[#111827] border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-gray-700 transition-all"
                  >
                    {/* Left Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#facc15] text-black font-black px-3 py-1 rounded-lg text-xs">
                          {ride.id}
                        </span>
                        <span className="text-xs text-gray-400">{ride.date}</span>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {ride.status || 'Completed'}
                        </span>
                      </div>

                      <div className="text-sm space-y-1 text-gray-300">
                        <p><span className="text-red-400">🚗 From:</span> {ride.from || 'N/A'}</p>
                        <p><span className="text-gray-400">🏁 To:</span> {ride.to || 'N/A'}</p>
                      </div>

                      <p className="text-xs text-gray-400">
                        Distance: <span className="text-white font-semibold">{ride.distance}</span> | Fare: <span className="text-[#facc15] font-bold">{ride.fare}</span>
                      </p>

                      {ride.review && (
                        <div className="mt-2 bg-[#0b0f19] p-2.5 rounded-xl border border-gray-800 text-xs text-gray-300">
                          <span className="text-yellow-400">{'★'.repeat(ride.review.rating)}</span>
                          <span className="text-gray-600">{'★'.repeat(5 - ride.review.rating)}</span>
                          <p className="italic text-gray-400 mt-0.5">"{ride.review.text}"</p>
                        </div>
                      )}
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-800">
                      <button
                        onClick={() => setSelectedReceipt(ride)}
                        className="flex-1 md:flex-none bg-[#1f2937] hover:bg-gray-800 text-gray-200 border border-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md text-center"
                      >
                        📄 View Receipt
                      </button>
                      <button
                        onClick={() => setSelectedReviewRide(ride)}
                        className="flex-1 md:flex-none bg-[#facc15] hover:bg-[#eab308] text-black px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer shadow-md text-center"
                      >
                        ⭐ Write Review
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h3 className="font-extrabold text-base text-[#facc15] tracking-wider uppercase">
                GO RAPID RECEIPT
              </h3>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Ride ID:</span>
                <span className="font-bold text-white">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pickup:</span>
                <span className="text-white font-medium">{selectedReceipt.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dropoff:</span>
                <span className="text-white font-medium">{selectedReceipt.to}</span>
              </div>

              <div className="border-t border-gray-800 pt-3 space-y-1.5">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span className="text-white">₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance ({selectedReceipt.distance})</span>
                  <span className="text-white">₹{(selectedReceipt.fareNum || 110) - 50}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-gray-800">
                  <span>Total Paid</span>
                  <span className="text-[#facc15]">{selectedReceipt.fare}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-6 w-full bg-[#facc15] text-black font-extrabold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {selectedReviewRide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h3 className="font-extrabold text-base text-[#facc15] uppercase">
                Write Review ({selectedReviewRide.id})
              </h3>
              <button
                onClick={() => setSelectedReviewRide(null)}
                className="text-gray-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl cursor-pointer transition-all ${
                        star <= reviewRating ? 'text-yellow-400 scale-110' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Kaisa tha apka ride experience?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3 rounded-xl text-xs cursor-pointer shadow-lg transition-all"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
