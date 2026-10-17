'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  // Step tracking: 'credentials' -> 'verify-otp'
  const [step, setStep] = useState<'credentials' | 'verify-otp'>('credentials')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  // 1. Send Real Email OTP (Password + OTP mode)
  const handleSendPasswordAndOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Sign up or verify credentials first
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: undefined }
    })

    if (signUpErr && !signUpErr.message.includes('User already registered')) {
      setMessage({ text: signUpErr.message, type: 'error' })
      setLoading(false)
      return
    }

    // Trigger Real Email OTP to Inbox
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })

    if (otpError) {
      setMessage({ text: otpError.message, type: 'error' })
    } else {
      setMessage({ text: 'A 6-digit OTP code has been sent to your email inbox!', type: 'success' })
      setStep('verify-otp')
    }
    setLoading(false)
  }

  // 2. Verify Real Email OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'OTP Verified! Redirecting...', type: 'success' })
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    }
    setLoading(false)
  }

  // 3. Direct OTP Only Flow
  const handleSendDirectOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'A 6-digit OTP code has been sent to your email inbox!', type: 'success' })
      setStep('verify-otp')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-gray-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wider">GO RAPID</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in or create an account to proceed</p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold text-center border backdrop-blur-md ${
              message.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-green-500/10 border-green-500/30 text-green-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => { 
              setAuthMethod('password')
              setStep('credentials')
              setMessage(null) 
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition ${
              authMethod === 'password' ? 'bg-yellow-400 text-black' : 'text-gray-400'
            }`}
          >
            Password + OTP
          </button>
          <button
            type="button"
            onClick={() => { 
              setAuthMethod('otp')
              setStep('credentials')
              setMessage(null) 
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition ${
              authMethod === 'otp' ? 'bg-yellow-400 text-black' : 'text-gray-400'
            }`}
          >
            Direct OTP Code
          </button>
        </div>

        {step === 'credentials' ? (
          authMethod === 'password' ? (
            <form onSubmit={handleSendPasswordAndOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-yellow-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Sending Real OTP...' : 'Send OTP to Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendDirectOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-yellow-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Sending Real OTP...' : 'Send OTP Code'}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Enter 6-digit Email OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-lg font-mono text-yellow-400 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-yellow-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials')
                  setMessage(null)
                }}
                className="text-xs text-gray-400 hover:text-yellow-400 transition"
              >
                ← Back to Email
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
