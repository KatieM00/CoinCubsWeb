import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Use placeholder values if env vars are missing (allows app to load for demo)
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

// Log configuration status (helpful for debugging)
console.log('Supabase Configuration:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'not set',
})

export const supabase = createClient(url, key, {
  auth: {
    // Only persist sessions when Supabase is properly configured
    // This prevents stale sessions from causing issues when using placeholder config
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
  }
})

// Type definitions
export type UserRole = 'teacher' | 'parent'

export interface UserProfile {
  id: string
  user_id: string
  email: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface ClassData {
  id: string
  teacher_profile_id: string
  class_name: string
  class_code: string
  school_year: string | null
  created_at: string
}

export interface StudentData {
  id: string
  class_id: string
  student_name: string
  balance: number
  is_active: boolean
  notes: string | null
  created_at: string
}
