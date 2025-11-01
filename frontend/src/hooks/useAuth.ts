import { useState, useEffect } from 'react'
import { supabase, UserProfile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useDemo } from '@/contexts/DemoContext'

interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const { isDemoMode, demoRole } = useDemo()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Create demo profile when in demo mode
  const demoProfile: UserProfile | null = isDemoMode && demoRole ? {
    id: 'demo-user-id',
    email: demoRole === 'teacher' ? 'demo.teacher@coincubs.com' : 'demo.parent@coincubs.com',
    role: demoRole,
    full_name: demoRole === 'teacher' ? 'Demo Teacher' : 'Demo Parent',
    created_at: new Date().toISOString()
  } : null

  useEffect(() => {
    // In demo mode, skip Supabase auth and use demo profile
    if (isDemoMode) {
      setIsLoading(false)
      setProfile(demoProfile)
      // Create a minimal mock user object for demo mode
      setUser({
        id: 'demo-user-id',
        email: demoProfile?.email ?? 'demo@coincubs.com',
        user_metadata: { full_name: demoProfile?.full_name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User)
      return
    }

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timed out')
      setIsLoading(false)
    }, 5000) // 5 second timeout

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout)
        setUser(session?.user ?? null)
        if (session?.user) {
          loadUserProfile(session.user.id)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        clearTimeout(timeout)
        console.error('Error getting session:', error)
        setIsLoading(false)
      })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [isDemoMode, demoProfile])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfile(null)
    }
  }

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
    refreshProfile
  }
}
