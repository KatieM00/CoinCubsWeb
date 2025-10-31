import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use placeholder values if env vars are missing (allows app to load for demo)
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

export const supabase = createClient(url, key)

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Type definitions
export type UserRole = 'teacher' | 'parent'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface ClassData {
  id: string
  teacher_id: string
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
