'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userOtp, setUserOtp] = useState('')
  const [activeOtp, setActiveOtp] = useState<string | null>(null)
  
  const [step, setStep] = useState<'credentials' | 'verify-otp'>('credentials')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  // Generate OTP & Send Real Email via API Route
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setActiveOtp(code)

    try {
      // Call backend API to send real email
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')

      if (authMethod === 'password') {
        const { error: signUpErr } = await supabase.auth.signUp({ email, password })
        if (signUpErr && !signUpErr.message.includes('User already registered')) {
          setMessage({ text: signUpErr.message, type: 'error' })
          setLoading(false)
          return
        }
      }

      setMessage({ text: 'Real OTP has been sent to your email inbox!', type: 'success' })
      setStep('verify-otp')
    } catch (err: any) {
      setMessage({ text: err.message || 'Error sending email', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP and Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (userOtp === activeOtp) {
      setMessage({ text: 'OTP Verified Successfully! Logging in...', type: 'success' })

      if (password) {
        await supabase.auth.signInWithPassword({ email, password }).catch(() => {})
      }

      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    } else {
      setMessage({ text: 'Invalid OTP code. Please check your inbox.', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
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
            <form onSubmit={handleSendEmailOtp} className="space-y-4">
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
                {loading ? 'Sending Email...' : 'Send OTP to Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendEmailOtp} className="space-y-4">
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
                {loading ? 'Sending Email...' : 'Send OTP Code to Email'}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Enter 6-digit OTP sent to your inbox</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
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
