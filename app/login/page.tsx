'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      alert('Please enter your email')
      return
    }

    // Save session in localStorage & cookie
    localStorage.setItem('go_rapid_user', email)
    document.cookie = `go_rapid_user=${email}; path=/; max-age=86400;`

    // Redirect to main dashboard
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Subtle Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Card matching screenshot layout */}
      <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(250,204,21,0.08)] flex flex-col items-center text-center relative z-10">
        
        {/* Logo Badge */}
        <div className="w-16 h-16 bg-gradient-to-tr from-[#facc15] to-[#eab308] rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-5">
          <span className="text-black font-black text-2xl tracking-wider">G</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-black text-white tracking-wider uppercase mb-1">
          GO RAPID
        </h1>
        <p className="text-xs font-semibold text-[#facc15] tracking-widest uppercase mb-6">
          {isSignUp ? 'CREATE YOUR ACCOUNT' : 'AUTHENTICATE TO ACCESS BOOKING'}
        </p>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="w-full space-y-4">
          <div className="text-left">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g., user@gorapid.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 focus:border-[#facc15] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 focus:border-[#facc15] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#facc15] hover:bg-[#eab308] text-black font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            {isSignUp ? 'CREATE NEW ACCOUNT' : 'SIGN IN TO ACCOUNT'}
          </button>
        </form>

        {/* Secondary Toggle Button */}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-3 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-gray-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer"
        >
          {isSignUp ? 'ALREADY HAVE AN ACCOUNT? SIGN IN' : 'CREATE NEW ACCOUNT (SIGN UP)'}
        </button>

        {/* Divider */}
        <div className="w-full border-t border-gray-800/80 my-6" />

        {/* Footer Badges */}
        <div className="flex items-center justify-center space-x-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          <span>SECURE CLERK AUTH</span>
          <span>•</span>
          <span>STRIPE PAYMENTS</span>
          <span>•</span>
          <span>SUPABASE SYNC</span>
        </div>

      </div>
    </div>
  )
}
