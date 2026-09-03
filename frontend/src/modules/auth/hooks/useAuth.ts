import { useState, useEffect } from 'react'
import { supabase } from '../../../services/supabaseClient'

interface User {
  id: string
  email: string
  user_metadata?: any
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const logout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setError(null)
    } catch (err) {
      setError('Failed to logout')
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, logout }
}
