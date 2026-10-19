'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'dashboard' | 'history'>('dashboard')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [distance, setDistance] = useState(10)
  const [rides, setRides] = useState<any[]>([])

  const ratePerKm = 15
  const baseFare = 50
  const totalFare = baseFare + distance * ratePerKm

  // Load saved rides from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('go_rapid_rides')
    if (saved) {
      setRides(JSON.parse(saved))
    } else {
      const initial = [
        { id: 'GR-2467', date: '19 Oct 2026', status: 'Completed', from: 'Kat Kat Gate', to: 'Jafar Gate', distance: '10 KM', fare: '₹200' },
        { id: 'GR-5279', date: '19 Oct 2026', status: 'Completed', from: 'Kat Kat Gate', to: 'Jafar Gate', distance: '10 KM', fare: '₹200' }
      ]
      setRides(initial)
      localStorage.setItem('go_rapid_rides', JSON.stringify(initial))
    }
  }, [])

  const handleBookRide = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations.')
      return
    }

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
    localStorage.setItem('go_rapid_rides', JSON.stringify(updated))
    alert(`Ride booked successfully! ID: ${randomId}`)
    setViewMode('history')
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-[#facc15] tracking-widest uppercase">
            GO RAPID
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode(viewMode === 'dashboard' ? 'history' : 'dashboard')}
              className="bg-[#111827] hover:bg-gray-800 text-yellow-400 border border-gray-800 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg"
            >
              {viewMode === 'dashboard' ? '📜 Manage Rides & History' : '🗺️ Back to Map & Book'}
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        {viewMode === 'dashboard' ? (
          /* Dashboard Layout: Map + Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Map iFrame */}
            <div className="bg-[#111827]/90 border border-gray-800 rounded-2xl overflow-hidden h-[550px] shadow-2xl relative">
              <div className="absolute top-4 left-4 z-10 bg-[#111827]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-800 text-xs font-semibold">
                Chhatrapati Sambhajinagar, Maharashtra, India
              </div>
              <iframe
                title="CartoDB Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://a.tile.openstreetmap.org/13/5938/3625.png"
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            {/* Right: Booking Form */}
            <div className="bg-[#111827]/90 border border-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span>🚗</span> Book & Pay via Distance
                </h2>

                <form onSubmit={handleBookRide} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
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
                    <label className="block text-xs font-medium text-gray-400 mb-2">
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
                    <div className="flex justify-between items-center mb-2">
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
                    className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-4 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
                  >
                    Confirm & Book Ride (₹{totalFare})
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* Ride History View */
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-200">Your Past Rides</h2>
            <div className="space-y-4">
              {rides.map((ride, index) => (
                <div
                  key={index}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl flex items-center justify-between"
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
                      <p><span className="text-red-400">🚗 From:</span> {ride.from}</p>
                      <p><span className="text-gray-400">🏁 To:</span> {ride.to}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Distance: <span className="text-white">{ride.distance}</span> | Fare: <span className="text-[#facc15]">{ride.fare}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
