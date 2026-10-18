'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  // States
  const [authMode, setAuthMode] = useState<'password-otp' | 'direct-otp'>('password-otp')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userOtp, setUserOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null)
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  // Step 1: Send OTP to User's Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!email) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' })
      setLoading(false)
      return
    }

    if (authMode === 'password-otp' && !password) {
      setMessage({ text: 'Please enter your password.', type: 'error' })
      setLoading(false)
      return
    }

    // Generate 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otpCode)

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      setMessage({ text: 'OTP code successfully sent to your email inbox!', type: 'success' })
      setStep('verify')
    } catch (err: any) {
      setMessage({ text: err.message || 'Error sending OTP to email', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (userOtp === generatedOtp) {
      setMessage({ text: 'OTP verified! Redirecting to dashboard...', type: 'success' })
      setTimeout(() => {
        router.push('/') // Redirect to main dashboard
      }, 1200)
    } else {
      setMessage({ text: 'Invalid OTP code. Please try again.', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#facc15] tracking-wider mb-2">
            GO RAPID
          </h1>
          <p className="text-sm text-gray-400">
            Sign in or create an account to proceed
          </p>
        </div>

        {/* Dynamic Alert Messages */}
        {message && (
          <div
            className={`mb-6 p-3.5 rounded-xl text-center text-sm font-medium transition-all ${
              message.type === 'error'
                ? 'bg-red-950/60 border border-red-800/80 text-red-300'
                : 'bg-green-950/60 border border-green-800/80 text-green-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Step 1: Credentials Form */}
        {step === 'credentials' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            {/* Auth Mode Toggle */}
            <div className="flex bg-[#1f2937] p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('password-otp')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'password-otp'
                    ? 'bg-[#facc15] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Password + OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('direct-otp')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'direct-otp'
                    ? 'bg-[#facc15] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Direct OTP Code
              </button>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-[#1b2333] border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] transition-all"
              />
            </div>

            {/* Password Field (if Password + OTP mode) */}
            {authMode === 'password-otp' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1b2333] border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] transition-all"
                />
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-bold py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:shadow-[#facc15]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? 'Sending OTP Code...' : 'Send OTP to Email'}
            </button>
          </form>
        )}

        {/* Step 2: Verification Form */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 text-center">
                Enter 6-Digit OTP sent to <span className="text-white font-semibold">{email}</span>
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[8px] text-xl font-bold bg-[#1b2333] border border-gray-700/60 rounded-xl px-4 py-3 text-[#facc15] placeholder-gray-600 focus:outline-none focus:border-[#facc15] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-bold py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:shadow-[#facc15]/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Log In'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full text-xs text-gray-400 hover:text-white transition-all text-center block pt-2"
            >
              ← Back to login form
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
