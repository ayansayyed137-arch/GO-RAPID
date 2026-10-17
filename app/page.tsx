'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Booking Form States
  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [distance, setDistance] = useState<number | null>(null)
  const [selectedCab, setSelectedCab] = useState<'auto' | 'mini' | 'sedan'>('auto')
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'searching' | 'booked'>('idle')
  const [activeRide, setActiveRide] = useState<any>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  // Calculate Distance & Price Logic
  const handleFindRides = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickup || !drop) return
    
    // Calculated mock distance
    const randomDist = Math.floor(Math.random() * 15) + 3
    setDistance(randomDist)
  }

  // Calculate Estimated Fare based on vehicle type
  const calculateFare = (dist: number, type: 'auto' | 'mini' | 'sedan') => {
    const baseRates = { auto: 15, mini: 20, sedan: 30 }
    return dist * baseRates[type]
  }

  // Book Ride Handler
  const handleBookRide = async () => {
    if (!distance) return
    setBookingStatus('searching')

    setTimeout(async () => {
      const fare = calculateFare(distance, selectedCab)
      const rideData = {
        pickup_location: pickup,
        drop_location: drop,
        distance_km: distance,
        fare: fare,
        vehicle_type: selectedCab,
        status: 'Completed',
        created_at: new Date().toISOString()
      }

      // Save to Supabase DB
      const { data, error } = await supabase.from('rides').insert([
        { ...rideData, user_id: user?.id }
      ]).select()

      setBookingStatus('booked')
      setActiveRide(rideData)
    }, 2000)
  }

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        <p className="text-yellow-400 text-lg font-bold tracking-wider animate-pulse">Loading GO RAPID...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/40 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-yellow-400 tracking-wider">GO RAPID</h1>
            <p className="text-xs text-gray-400 mt-0.5">Welcome back, <span className="text-white font-medium">{user?.email}</span></p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Ride History Button */}
            <Link href="/rides">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-yellow-500/10 transition flex items-center gap-2 text-xs md:text-sm">
                View Ride History & Receipts 🛺
              </button>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-4 py-2.5 rounded-xl transition text-xs md:text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Ride Booking Card Section */}
        <div className="bg-gray-900/50 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-yellow-400">Book Your Ride</h2>
            <p className="text-xs text-gray-400 mt-1">Select pickup & destination to check fares and available vehicles</p>
          </div>

          <form onSubmit={handleFindRides} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Pickup Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kat Kat Gate"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Drop Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roshan Gate"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-yellow-500/20 text-sm"
            >
              Find Available Rides
            </button>
          </form>

          {/* Available Cabs & Fare Estimate Section */}
          {distance && bookingStatus === 'idle' && (
            <div className="pt-6 border-t border-white/10 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-200">Select Vehicle</h3>
                <span className="text-xs text-yellow-400 font-mono">Distance: ~{distance} KM</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'auto', name: 'Auto', icon: '🛺' },
                  { id: 'mini', name: 'Cab Mini', icon: '🚗' },
                  { id: 'sedan', name: 'Cab Sedan', icon: '🚘' }
                ].map((cab) => {
                  const fare = calculateFare(distance, cab.id as any)
                  return (
                    <button
                      key={cab.id}
                      type="button"
                      onClick={() => setSelectedCab(cab.id as any)}
                      className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        selectedCab === cab.id
                          ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                          : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">{cab.icon}</span>
                      <span className="text-xs font-bold text-white">{cab.name}</span>
                      <span className="text-sm font-extrabold text-yellow-400 mt-1">₹{fare}</span>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleBookRide}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-extrabold py-3.5 rounded-xl transition shadow-xl shadow-yellow-500/20 text-sm mt-2"
              >
                Confirm & Book {selectedCab.toUpperCase()} (₹{calculateFare(distance, selectedCab)})
              </button>
            </div>
          )}

          {/* Searching Animation */}
          {bookingStatus === 'searching' && (
            <div className="py-8 text-center space-y-3 border-t border-white/10">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-yellow-400">Connecting with nearby drivers...</p>
            </div>
          )}

          {/* Booking Confirmed State */}
          {bookingStatus === 'booked' && activeRide && (
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-3">
              <span className="text-3xl">✅</span>
              <h3 className="text-lg font-bold text-green-400">Ride Booked Successfully!</h3>
              <p className="text-xs text-gray-300">
                Driver is on the way for {activeRide.pickup_location} ➔ {activeRide.drop_location} (Total: ₹{activeRide.fare})
              </p>
              <button
                onClick={() => {
                  setBookingStatus('idle')
                  setDistance(null)
                  setPickup('')
                  setDrop('')
                }}
                className="text-xs text-yellow-400 underline font-semibold mt-2"
              >
                Book Another Ride
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
