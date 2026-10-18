'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userOtp, setUserOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null)
  const [step, setStep] = useState<'credentials' | 'verify'>('credentials')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!email || !password) {
      setMessage({ text: 'Please fill in all fields', type: 'error' })
      setLoading(false)
      return
    }

    // Dummy 6-digit OTP generation for smooth flow
    const dummyOtp = '123456'
    setGeneratedOtp(dummyOtp)

    setTimeout(() => {
      setLoading(false)
      setStep('verify')
      setMessage({ text: `OTP sent successfully! (Use code: ${dummyOtp})`, type: 'success' })
    }, 600)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (userOtp === generatedOtp || userOtp === '123456') {
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' })
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      setMessage({ text: 'Invalid OTP. Please enter 123456', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#facc15] tracking-wider mb-2">
            GO RAPID
          </h1>
          <p className="text-sm text-gray-400">
            Sign in to book your ride instantly
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-3.5 rounded-xl text-center text-xs font-semibold ${
            message.type === 'error' 
              ? 'bg-red-950/80 border border-red-800 text-red-200' 
              : 'bg-green-950/80 border border-green-700 text-green-200'
          }`}>
            {message.text}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2"
            >
              {loading ? 'Processing...' : 'Continue with OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 text-center">
                Enter verification code sent to <span className="text-white">{email}</span>
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[8px] text-xl font-bold bg-[#1b2333] border border-gray-700 rounded-xl px-4 py-3 text-[#facc15] focus:outline-none focus:border-[#facc15]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full text-xs text-gray-400 hover:text-white pt-2 text-center block"
            >
              ← Back to login
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
