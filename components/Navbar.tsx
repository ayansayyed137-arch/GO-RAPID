'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Bahar click karne par dropdown close ho jaye
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsOpen(false)
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white relative">
      <h1 className="text-xl font-bold text-yellow-400">GO RAPID</h1>

      <div>
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Avatar Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 focus:outline-none bg-gray-800 p-2 rounded-full border border-gray-700 hover:border-yellow-400 transition"
            >
              <div className="w-9 h-9 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-lg">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50 text-white">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center text-xl">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">User Account</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Manage Account Option */}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    alert('Manage account settings coming soon!')
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 flex items-center gap-3 text-gray-200 transition"
                >
                  <span className="text-base">⚙️</span> Manage account
                </button>

                {/* Sign Out Option */}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800 flex items-center gap-3 text-red-400 transition border-t border-gray-800"
                >
                  <span className="text-base">🚪</span> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  )
}
