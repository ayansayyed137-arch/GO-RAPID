'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/client'

export default function Home() {
  const [authChecking, setAuthChecking] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkUserSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login') // App khulne se pehle /login par redirect karega
      } else {
        setAuthChecking(false)
      }
    }
    checkUserSession()
  }, [])

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-yellow-400 text-sm font-semibold">
        Checking Authentication...
      </div>
    )
  }

  return (
    // Aapka baki saara main dashboard UI code yahan rahega...
    <main>...</main>
  )
}
