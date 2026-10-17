'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function RideHistoryPage() {
  const [rides, setRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const fetchRides = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Apke database table ka naam yahan 'rides' ya 'bookings' ho sakta hai
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRides(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRides()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#030712] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-yellow-400 tracking-wide">GO RAPID</h1>
            <p className="text-xs text-gray-400 mt-1">Your Past Rides & Payment Receipts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              Back to Home
            </button>
            <button
              onClick={fetchRides}
              className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-yellow-500 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl">
          {loading ? (
            <p className="text-center text-gray-400 py-12 text-sm">Loading your ride history...</p>
          ) : rides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">No recent rides found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map((ride, index) => (
                <div key={index} className="bg-black/40 border border-white/10 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-yellow-400">{ride.pickup || 'Pickup Location'} $\rightarrow$ {ride.dropoff || 'Destination'}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(ride.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">₹{ride.fare || 200}</p>
                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
