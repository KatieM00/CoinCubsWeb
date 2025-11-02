-- ============================================================================
-- COINC UBS DUAL-ROLE MIGRATION
-- ============================================================================
-- This migration enables users to have both Teacher AND Parent roles
-- Migration Date: 2025-11-01
--
-- IMPORTANT: Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Rename user_profiles to profiles (to match code expectations)
-- ============================================================================

-- Drop existing policies that reference user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Rename the table
ALTER TABLE IF EXISTS public.user_profiles RENAME TO profiles;

-- ============================================================================
-- STEP 2: Modify profiles table to support multiple roles per user
-- ============================================================================

-- Drop the old primary key constraint (only allows one profile per user)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;

-- Add composite primary key (user can have multiple profiles, one per role)
ALTER TABLE public.profiles ADD PRIMARY KEY (id, role);

-- Update role constraint to use 'teacher' and 'parent' instead of 'admin' and 'user'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('teacher', 'parent'));

-- ============================================================================
-- STEP 3: Create missing CLASSES table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  school_year TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_class_code ON public.classes(class_code);
CREATE INDEX IF NOT EXISTS idx_classes_is_active ON public.classes(is_active);

-- Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes
-- Teachers can manage their own classes
CREATE POLICY "Teachers can manage own classes"
  ON public.classes
  FOR ALL
  USING (
    auth.uid() = teacher_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view classes they're enrolled in
CREATE POLICY "Parents can view enrolled classes"
  ON public.classes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_class_enrollments
      WHERE parent_id = auth.uid() AND class_id = classes.id
    )
  );

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_classes
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- STEP 4: Create PARENT-CLASS enrollment table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.parent_class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  child_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, class_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_parent_enrollments_parent_id ON public.parent_class_enrollments(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_enrollments_class_id ON public.parent_class_enrollments(class_id);

-- Enable Row Level Security
ALTER TABLE public.parent_class_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Parents can manage their own enrollments
CREATE POLICY "Parents can manage own enrollments"
  ON public.parent_class_enrollments
  FOR ALL
  USING (auth.uid() = parent_id);

-- Teachers can view enrollments in their classes
CREATE POLICY "Teachers can view class enrollments"
  ON public.parent_class_enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_id AND classes.teacher_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 5: Update RLS policies for profiles table
-- ============================================================================

-- Users can view their own profiles (all roles)
CREATE POLICY "Users can view own profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profiles (all roles)
CREATE POLICY "Users can insert own profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profiles
CREATE POLICY "Users can update own profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profiles (for role removal)
CREATE POLICY "Users can delete own profiles"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- STEP 6: Update existing table references and policies
-- ============================================================================

-- Update student_accounts foreign key
ALTER TABLE public.student_accounts
  DROP CONSTRAINT IF EXISTS student_accounts_created_by_fkey;

ALTER TABLE public.student_accounts
  ADD CONSTRAINT student_accounts_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update class_funds foreign key
ALTER TABLE public.class_funds
  DROP CONSTRAINT IF EXISTS class_funds_created_by_fkey;

ALTER TABLE public.class_funds
  ADD CONSTRAINT class_funds_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update transactions foreign key
ALTER TABLE public.transactions
  DROP CONSTRAINT IF EXISTS transactions_created_by_fkey;

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update rewards foreign key
ALTER TABLE public.rewards
  DROP CONSTRAINT IF EXISTS rewards_created_by_fkey;

ALTER TABLE public.rewards
  ADD CONSTRAINT rewards_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update class_goals foreign key
ALTER TABLE public.class_goals
  DROP CONSTRAINT IF EXISTS class_goals_created_by_fkey;

ALTER TABLE public.class_goals
  ADD CONSTRAINT class_goals_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update voting_proposals foreign key
ALTER TABLE public.voting_proposals
  DROP CONSTRAINT IF EXISTS voting_proposals_created_by_fkey;

ALTER TABLE public.voting_proposals
  ADD CONSTRAINT voting_proposals_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to use new role values
DROP POLICY IF EXISTS "Admins can manage student accounts" ON public.student_accounts;
DROP POLICY IF EXISTS "Parents can view student accounts" ON public.student_accounts;
DROP POLICY IF EXISTS "Admins can manage class funds" ON public.class_funds;
DROP POLICY IF EXISTS "Parents can view class funds" ON public.class_funds;
DROP POLICY IF EXISTS "Admins can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "Parents can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can manage rewards" ON public.rewards;
DROP POLICY IF EXISTS "Parents can view rewards" ON public.rewards;
DROP POLICY IF EXISTS "Admins can manage class goals" ON public.class_goals;
DROP POLICY IF EXISTS "Parents can view class goals" ON public.class_goals;
DROP POLICY IF EXISTS "Admins can manage voting proposals" ON public.voting_proposals;
DROP POLICY IF EXISTS "Parents can view voting proposals" ON public.voting_proposals;

-- Teachers can manage student accounts
CREATE POLICY "Teachers can manage student accounts"
  ON public.student_accounts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view student accounts (read-only)
CREATE POLICY "Parents can view student accounts"
  ON public.student_accounts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Teachers can manage class funds
CREATE POLICY "Teachers can manage class funds"
  ON public.class_funds
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view class funds (read-only)
CREATE POLICY "Parents can view class funds"
  ON public.class_funds
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Teachers can manage transactions
CREATE POLICY "Teachers can manage transactions"
  ON public.transactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view transactions (read-only)
CREATE POLICY "Parents can view transactions"
  ON public.transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Teachers can manage rewards
CREATE POLICY "Teachers can manage rewards"
  ON public.rewards
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view rewards (read-only)
CREATE POLICY "Parents can view rewards"
  ON public.rewards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Teachers can manage class goals
CREATE POLICY "Teachers can manage class goals"
  ON public.class_goals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view class goals (read-only)
CREATE POLICY "Parents can view class goals"
  ON public.class_goals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Teachers can manage voting proposals
CREATE POLICY "Teachers can manage voting proposals"
  ON public.voting_proposals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Parents can view voting proposals (read-only)
CREATE POLICY "Parents can view voting proposals"
  ON public.voting_proposals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- Summary of changes:
-- ✅ Renamed user_profiles → profiles
-- ✅ Changed PRIMARY KEY to allow multiple roles per user
-- ✅ Updated role constraint: 'admin'/'user' → 'teacher'/'parent'
-- ✅ Created classes table
-- ✅ Created parent_class_enrollments table
-- ✅ Updated all foreign key constraints to reference auth.users
-- ✅ Updated all RLS policies to use new role values
-- ============================================================================
