'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function RideHistoryPage() {
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
    <div className="min-h-screen bg-[#070b14] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-amber-400 mb-8">Your Ride History</h1>

        {loading ? (
          <p className="text-slate-400">Loading your rides...</p>
        ) : rides.length === 0 ? (
          <p className="text-slate-400">No rides found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
              >
                {/* Ride Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ride.status || 'Completed'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: #{ride.id.slice(0, 8)}...
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-amber-400">Pickup:</strong> {ride.pickup_location || 'N/A'}
                  </p>
                  <p className="text-sm text-slate-300">
                    <strong className="text-amber-400">Dropoff:</strong> {ride.dropoff_location || 'N/A'}
                  </p>
                </div>

                {/* Explicit View Receipt Button */}
                <button
                  onClick={() => setSelectedRide(ride)}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-xl cursor-pointer"
                >
                  📄 View Receipt
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Popup Modal */}
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
                  <span className="uppercase font-bold text-emerald-400">{selectedRide.status || 'Completed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup:</span>
                  <span className="font-medium text-white text-right">{selectedRide.pickup_location || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dropoff:</span>
                  <span className="font-medium text-white text-right">{selectedRide.dropoff_location || 'N/A'}</span>
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