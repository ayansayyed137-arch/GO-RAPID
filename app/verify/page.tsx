'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('go_rapid_user')
    if (storedEmail) {
      setUserEmail(storedEmail)
    }
  }, [])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length < 6) {
      alert('Please enter a valid 6-digit verification code.')
      return
    }

    setIsLoading(true)

    // Simulate OTP verification (or call a backend verify route if you have one)
    setTimeout(() => {
      setIsLoading(false)
      // Save authenticated session state
      localStorage.setItem('go_rapid_user', userEmail || 'customer@gorapid.com')
      document.cookie = `go_rapid_user=${userEmail || 'customer@gorapid.com'}; path=/; max-age=86400;`
      router.push('/')
    }, 1000)
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
            Enter Email 2FA Code
          </p>
          {userEmail && (
            <p className="text-xs text-yellow-500/90 mt-2 font-mono">
              Sent to: {userEmail}
            </p>
          )}
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 text-center">
              ENTER 6-DIGIT EMAIL CODE
            </label>
            <input
              type="text"
              maxLength={6}
              required
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3.5 text-center text-xl tracking-[0.5em] text-[#facc15] placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-4 rounded-xl shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Verifying Code...' : 'VERIFY & ACCESS DASHBOARD'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/login')}
            className="text-xs text-gray-400 hover:text-[#facc15] transition-all cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>

      </div>
    </div>
  )
}
