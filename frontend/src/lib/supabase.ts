import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
