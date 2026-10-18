'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Please enter both email and password')
      setLoading(false)
      return
    }

    // Instant successful login simulation & redirect
    setTimeout(() => {
      localStorage.setItem('go_rapid_user', email)
      router.push('/')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#facc15] tracking-wider mb-2">
            GO RAPID
          </h1>
          <p className="text-sm text-gray-400">
            Instant Login to Book Your Ride
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl text-center text-xs font-semibold bg-red-950/80 border border-red-800 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleDirectLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full bg-[#1b2333] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#facc15]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1b2333] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#facc15]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-4 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  )
}
