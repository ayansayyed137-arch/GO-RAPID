// 1. Password Based Auth Handler
const handlePasswordAuth = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage(null)

  if (isSignUp) {
    // Direct sign up bypassing email redirect flow
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: undefined, // Email trigger stop karne ke liye
      }
    })

    if (error) {
      // Agar user pehle se exist karta hai, toh auto sign-in kar lo
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
      // Direct session login agar create ho gaya
      if (data.session) {
        setMessage({ text: 'Account created! Redirecting...', type: 'success' })
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1000)
      } else {
        // Fallback login attempt
        const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password })
        if (!loginErr) {
          router.push('/')
          router.refresh()
        } else {
          setMessage({ text: 'Please click "Already have an account? Sign In" below to log in!', type: 'success' })
        }
      }
    }
  } else {
    // Normal Sign In (No Email Rate Limit applies here)
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
