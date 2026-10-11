'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function RideHistory() {
  const [rides, setRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRide, setSelectedRide] = useState<any>(null)

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRides(data)
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-amber-400">Your Ride History</h3>
        <button
          onClick={fetchRides}
          className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-10">Loading your past rides...</p>
      ) : rides.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-10">No past rides found. Book your first ride above!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {rides.map((ride) => {
            // Flexible field matching for Supabase columns
            const pickup = ride.pickup_location || ride.pickup || 'Location not specified'
            const dropoff = ride.dropoff_location || ride.dropoff || 'Location not specified'
            const status = ride.status || 'Completed'
            const fareAmount = ride.fare || 250

            return (
              <div
                key={ride.id}
                className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
              >
                {/* Left Side: Ride Route Info */}
                <div className="flex flex-col gap-2.5 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: #{ride.id}
                    </span>
                  </div>

                  <div className="text-sm text-slate-300 flex flex-col gap-1 mt-1">
                    <p>
                      <strong className="text-amber-400">Pickup:</strong> {pickup}
                    </p>
                    <p>
                      <strong className="text-amber-400">Dropoff:</strong> {dropoff}
                    </p>
                  </div>
                </div>

                {/* Right Side: View Receipt Button */}
                <button
                  onClick={() => setSelectedRide(ride)}
                  className="w-full md:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>📄</span> View Receipt
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Receipt Modal Popup */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0e1626] border border-slate-800 p-6 rounded-2xl w-full max-w-md text-white shadow-2xl">
            <div className="flex flex-col gap-4 bg-[#070b14] p-6 rounded-xl border border-slate-800">
              <div className="text-center border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-black text-amber-400">GO RAPID</h2>
                <p className="text-xs text-slate-400">Official Ride Receipt</p>
              </div>

              <div className="flex flex-col gap-2.5 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking ID:</span>
                  <span className="font-mono text-xs text-amber-300">#{selectedRide.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="uppercase font-bold text-emerald-400">
                    {selectedRide.status || 'Completed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup:</span>
                  <span className="font-medium text-white text-right">
                    {selectedRide.pickup_location || selectedRide.pickup || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dropoff:</span>
                  <span className="font-medium text-white text-right">
                    {selectedRide.dropoff_location || selectedRide.dropoff || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center font-bold text-lg">
                <span>Total Paid:</span>
                <span className="text-emerald-400">₹{selectedRide.fare || 250}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition cursor-pointer"
              >
                Print / PDF
              </button>
              <button
                onClick={() => setSelectedRide(null)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}