'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password')
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  // Password Based Auth Handler
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: undefined }
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
          if (!signInErr) {
            setMessage({ text: 'Signed in successfully!', type: 'success' })
            router.push('/')
            router.refresh()
            return
          }
        }
        setMessage({ text: error.message, type: 'error' })
      } else {
        if (data.session) {
          setMessage({ text: 'Account created! Redirecting...', type: 'success' })
          setTimeout(() => {
            router.push('/')
            router.refresh()
          }, 1000)
        } else {
          const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
          if (!loginErr) {
            router.push('/')
            router.refresh()
          } else {
            setMessage({ text: 'Account created! Please switch to Sign In to continue.', type: 'success' })
          }
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ text: error.message, type: 'error' })
      } else {
        setMessage({ text: 'Signed in successfully!', type: 'success' })
        router.push('/')
        router.refresh()
      }
    }
    setLoading(false)
  }

  // OTP Send Handler
  const handleSendOtp = async (e: React.FormEvent) => {
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
      setMessage({ text: '6-digit OTP code sent to your email!', type: 'success' })
      setStep('otp')
    }
    setLoading(false)
  }

  // OTP Verify Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'OTP Verified Successfully!', type: 'success' })
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-gray-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wider">GO RAPID</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in or create an account to proceed</p>
        </div>

        {/* Message Banner */}
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
              setAuthMethod('password'); 
              setMessage(null); 
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition ${
              authMethod === 'password' ? 'bg-yellow-400 text-black' : 'text-gray-400'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { 
              setAuthMethod('otp'); 
              setMessage(null); 
            }}
            className={`w-1/2 py-2 text-xs font-bold rounded-lg transition ${
              authMethod === 'otp' ? 'bg-yellow-400 text-black' : 'text-gray-400'
            }`}
          >
            OTP Code
          </button>
        </div>

        {/* Form Selection */}
        {authMethod === 'password' ? (
          <form onSubmit={handlePasswordAuth} className="space-y-4">
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
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setMessage(null)
                }}
                className="text-xs text-gray-400 hover:text-yellow-400 transition"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        ) : step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
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
              {loading ? 'Sending OTP...' : 'Send OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Enter 6-digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
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
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
