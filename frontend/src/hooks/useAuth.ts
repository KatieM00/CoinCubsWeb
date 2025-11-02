import { useState, useEffect, useMemo } from 'react'
import { supabase, UserProfile } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useDemo } from '@/contexts/DemoContext'

interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null  // Currently active profile
  profiles: UserProfile[]  // All profiles for this user
  activeRole: 'teacher' | 'parent' | null
  hasMultipleRoles: boolean
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  switchRole: (role: 'teacher' | 'parent') => void
}

export function useAuth(): UseAuthReturn {
  const { isDemoMode, demoRole } = useDemo()
  const [user, setUser] = useState<User | null>(null)
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [activeRole, setActiveRole] = useState<'teacher' | 'parent' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Create demo profile when in demo mode
  const demoProfile: UserProfile | null = useMemo(() =>
    isDemoMode && demoRole ? {
      id: 'demo-user-id',
      email: demoRole === 'teacher' ? 'demo.teacher@coincubs.com' : 'demo.parent@coincubs.com',
      role: demoRole,
      full_name: demoRole === 'teacher' ? 'Demo Teacher' : 'Demo Parent',
      created_at: new Date().toISOString()
    } : null
  , [isDemoMode, demoRole])

  useEffect(() => {
    // In demo mode, skip Supabase auth and use demo profile
    if (isDemoMode) {
      setIsLoading(false)
      setProfiles(demoProfile ? [demoProfile] : [])
      setActiveRole(demoRole)
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
        setProfiles([])
        setActiveRole(null)
      }
      setIsLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [isDemoMode, demoRole])

  const loadUserProfile = async (userId: string) => {
    try {
      // Load ALL profiles for this user (may have both teacher and parent)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)

      if (error) {
        console.error('Error loading profiles:', error)
        setProfiles([])
        setActiveRole(null)
      } else if (data && data.length > 0) {
        setProfiles(data)
        // Don't auto-set activeRole - let user choose via RoleSelection or RoleSwitcher
      } else {
        setProfiles([])
        setActiveRole(null)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
      setProfiles([])
      setActiveRole(null)
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

  const switchRole = (role: 'teacher' | 'parent') => {
    console.log(`🔄 switchRole called with role: ${role}`)
    console.log(`🔍 Current profiles:`, profiles)
    console.log(`🔍 Current activeRole:`, activeRole)

    // Check if user has this role
    const hasRole = profiles.some(p => p.role === role)
    console.log(`🔍 User has ${role} role:`, hasRole)

    if (hasRole) {
      setActiveRole(role)
      console.log(`✅ Switched to ${role} role`)
    } else {
      console.warn(`⚠️ User does not have ${role} role`)
    }
  }

  // Compute active profile based on activeRole
  const profile = profiles.find(p => p.role === activeRole) || profiles[0] || null
  const hasMultipleRoles = profiles.length > 1

  return {
    user,
    profile,
    profiles,
    activeRole,
    hasMultipleRoles,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
    refreshProfile,
    switchRole
  }
}
