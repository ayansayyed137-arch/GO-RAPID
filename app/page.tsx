'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pickup, dropoff, amount: 250 }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed')
      }
    } catch (err) {
      alert('Error initiating checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      {/* Dynamic Navbar with Profile Dropdown */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Side: Map View */}
          <div className="bg-[#111827] p-4 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="relative w-full h-[350px] rounded-xl overflow-hidden">
              <iframe
                title="Aurangabad Map"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15008.204561021462!2d75.3239!3d19.8762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdba29283e351eb%3A0x86134b3f88d227d8!2sChhatrapati%20Sambhajinagar%20(Aurangabad)!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              ></iframe>
            </div>
          </div>

          {/* Right Side: Booking Form */}
          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Book & Pay via Stripe</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Pickup Location</label>
                <input
                  type="text"
                  placeholder="e.g., Kat Kat Gate"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Dropoff Location</label>
                <input
                  type="text"
                  placeholder="e.g., Jafar Gate"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <span>💳</span>
                <span>{loading ? 'Processing...' : 'Pay ₹250 with Stripe'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Ride History Section */}
        <div className="mt-8 bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-yellow-400">Your Ride History</h3>
            <button className="bg-gray-800 text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700">
              🔄 Refresh
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center py-6">No recent rides found.</p>
        </div>
      </div>
    </main>
  )
}
