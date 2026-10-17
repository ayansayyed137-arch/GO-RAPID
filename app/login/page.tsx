'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email') // 'email' or 'otp'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const supabase = createClient()
  const router = useRouter()

  // Step 1: Mail par OTP Bhejo
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Naye user ka automatic account create karega
      },
    })

    if (error) {
      setMessage({ text: error.message, type: 'error' })
    } else {
      setMessage({ text: 'A 6-digit OTP has been sent to your email!', type: 'success' })
      setStep('otp')
    }
    setLoading(false)
  }

  // Step 2: OTP Verify Karein
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
      setMessage({ text: 'OTP verified! Redirecting...', type: 'success' })
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
          <p className="text-xs text-gray-400 mt-1">
            {step === 'email' ? 'Enter your email to receive OTP' : 'Enter the 6-digit OTP sent to your mail'}
          </p>
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

        {step === 'email' ? (
          /* Form 1: Email Input */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-yellow-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          /* Form 2: OTP Input */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Enter OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-lg font-mono text-yellow-400 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-yellow-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Log In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email')
                setMessage(null)
              }}
              className="w-full text-xs text-gray-400 hover:text-yellow-400 transition text-center pt-2"
            >
              ← Change Email
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
