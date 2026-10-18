'use client'

import React, { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Save user session in local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('go_rapid_user', email)
      // Instant hard navigate to dashboard
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4 selection:bg-[#facc15] selection:text-black">
      {/* Background Subtle Glowing Effect */}
      <div className="absolute w-72 h-72 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl shadow-black/50">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#facc15] tracking-wider mb-1 uppercase">
            GO RAPID
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Sign in to access your ride booking dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@gorapid.com"
              className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15] transition-all"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 rounded-xl shadow-lg shadow-[#facc15]/10 hover:shadow-[#facc15]/20 transition-all duration-200 text-sm mt-3 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Card Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-500">
            Powered by GO RAPID Services &copy; 2026
          </p>
        </div>

      </div>
    </div>
  )
}
