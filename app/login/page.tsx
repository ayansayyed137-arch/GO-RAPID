'use client'

import React, { useState } from 'react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || (isSignUp && !name)) {
      alert('Please fill in all required fields.')
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('go_rapid_user', email)
      if (name) {
        localStorage.setItem('go_rapid_name', name)
      }
      document.cookie = `go_rapid_user=${email}; path=/; max-age=86400;`
      
      // Direct hard redirect to dashboard
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#facc15] tracking-wider mb-1 uppercase">
            GO RAPID
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            {isSignUp ? 'Create a new account to book rides' : 'Sign in to access your ride booking dashboard'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required={isSignUp}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@gorapid.com"
              className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1b2333] border border-gray-700/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#facc15]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-3 cursor-pointer"
          >
            {isSignUp ? 'Create Account & Login' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Toggle option */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-gray-400 hover:text-[#facc15] transition-all cursor-pointer font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create New Account"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-500">
            Powered by GO RAPID Services &copy; 2026
          </p>
        </div>

      </div>
    </div>
  )
}
