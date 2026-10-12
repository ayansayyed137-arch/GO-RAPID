'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for the confirmation link or you are signed up!')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
      <div className="w-full max-w-md p-8 bg-[#131B2E] rounded-xl border border-gray-800 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400 text-center">GO RAPID - Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded hover:bg-yellow-500 transition"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
          <button 
            type="button" 
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-3 bg-transparent border border-yellow-400 text-yellow-400 font-bold rounded hover:bg-yellow-400/10 transition mt-2"
          >
            Create Account (Sign Up)
          </button>
        </form>
      </div>
    </div>
  )
}
