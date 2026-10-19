'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      alert('Please enter your email address.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        // Save email in localStorage for verification step
        localStorage.setItem('go_rapid_user', email)
        // Redirect to verify page
        router.push('/verify')
      } else {
        alert(data.error || 'Failed to send OTP. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('OTP request error:', error)
      alert('Error connecting to authentication service.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#facc15] tracking-widest uppercase">
            GO RAPID
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Secure Email Sign In & 2FA
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-4 rounded-xl shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Sending Secure Code...' : 'Continue with Email'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[11px] text-gray-500">
            Protected by GoRapid Secure Auth & Stripe Gateway
          </p>
        </div>

      </div>
    </div>
  )
}
