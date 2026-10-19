'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GoRapidDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('history') // 'history', 'receipt', 'review'
  const [pickup, setPickup] = useState('Kat Kat Gate')
  const [dropoff, setDropoff] = useState('Jafar Gate')
  const [distance, setDistance] = useState(10)
  const [fare, setFare] = useState(200)
  const [rides, setRides] = useState<any[]>([])

  // Load ride history on mount
  useEffect(() => {
    const savedRides = localStorage.getItem('go_rapid_rides')
    if (savedRides) {
      setRides(JSON.parse(savedRides))
    } else {
      const initialRides = [
        { id: 'GR-2467', date: '19 Oct 2026', status: 'Completed', from: 'Kat Kat Gate', to: 'Jafar Gate', distance: '10 KM', fare: '₹200' },
        { id: 'GR-5279', date: '19 Oct 2026', status: 'Completed', from: 'Kat Kat Gate', to: 'Jafar Gate', distance: '10 KM', fare: '₹200' }
      ]
      setRides(initialRides)
      localStorage.setItem('go_rapid_rides', JSON.stringify(initialRides))
    }
  }, [])

  // Handle new ride booking simulation
  const handleBookNewRide = () => {
    const randomId = 'GR-' + Math.floor(1000 + Math.random() * 9000)
    const newRide = {
      id: randomId,
      date: '19 Oct 2026',
      status: 'Completed',
      from: pickup,
      to: dropoff,
      distance: distance + ' KM',
      fare: '₹' + fare,
    }

    const updatedRides = [newRide, ...rides]
    setRides(updatedRides)
    localStorage.setItem('go_rapid_rides', JSON.stringify(updatedRides))
    alert(`Ride ${randomId} successfully booked and added to history!`)
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navbar / Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#facc15] text-black shadow-lg shadow-yellow-500/20'
                  : 'bg-[#111827] text-gray-300 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              📜 Ride History
            </button>
            <button
              onClick={() => setActiveTab('receipt')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'receipt'
                  ? 'bg-[#facc15] text-black shadow-lg shadow-yellow-500/20'
                  : 'bg-[#111827] text-gray-300 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              📄 View Receipt {rides.length > 0 ? `(${rides[0].id})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === 'review'
                  ? 'bg-[#facc15] text-black shadow-lg shadow-yellow-500/20'
                  : 'bg-[#111827] text-gray-300 border border-gray-800 hover:bg-gray-800'
              }`}
            >
              ⭐ Write Review
            </button>
          </div>

          <button
            onClick={handleBookNewRide}
            className="bg-green-500 hover:bg-green-600 text-black font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg cursor-pointer"
          >
            + Book New Ride
          </button>
        </div>

        {/* Content Section */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-200">Your Past Rides</h2>
            <div className="space-y-4">
              {rides.map((ride, index) => (
                <div
                  key={index}
                  className="bg-[#111827]/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
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

                    <p className="text-xs text-gray-400 font-semibold">
                      Distance: <span className="text-white">{ride.distance}</span> | Fare: <span className="text-[#facc15]">{ride.fare}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setActiveTab('receipt')}
                      className="flex-1 md:flex-none bg-[#1f2937] hover:bg-gray-800 text-gray-200 text-xs font-bold px-4 py-3 rounded-xl border border-gray-700 transition-all cursor-pointer"
                    >
                      View Receipt
                    </button>
                    <button
                      onClick={() => setActiveTab('review')}
                      className="flex-1 md:flex-none bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-extrabold px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'receipt' && (
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl">
            <h2 className="text-xl font-bold text-[#facc15] mb-4 text-center">Ride Receipt</h2>
            {rides.length > 0 && (
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Ride ID</span>
                  <span className="font-mono text-[#facc15]">{rides[0].id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Date</span>
                  <span>{rides[0].date}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Pickup</span>
                  <span>{rides[0].from}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Dropoff</span>
                  <span>{rides[0].to}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Distance</span>
                  <span>{rides[0].distance}</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold text-white">
                  <span>Total Fare</span>
                  <span className="text-[#facc15]">{rides[0].fare}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setActiveTab('history')}
              className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              ← Back to History
            </button>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl text-center">
            <h2 className="text-xl font-bold text-[#facc15] mb-2">Rate Your Ride</h2>
            <p className="text-xs text-gray-400 mb-6">How was your experience with GoRapid?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {['⭐', '⭐', '⭐', '⭐', '⭐'].map((star, i) => (
                <span key={i} className="text-2xl cursor-pointer hover:scale-110 transition-transform">
                  {star}
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your feedback..."
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] mb-4 h-28 resize-none"
            />

            <button
              onClick={() => {
                alert('Thank you for your feedback!')
                setActiveTab('history')
              }}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
