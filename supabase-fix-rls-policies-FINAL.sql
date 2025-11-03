-- ============================================================================
-- FINAL FIX: Drop ALL existing policies and rebuild from scratch
-- ============================================================================
-- This drops every single policy on these tables and rebuilds cleanly
-- Run this in your Supabase SQL Editor

-- Step 1: Drop EVERY policy that exists on classes table
DROP POLICY IF EXISTS "Teachers can manage own classes" ON public.classes;
DROP POLICY IF EXISTS "Parents can view enrolled classes" ON public.classes;
DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;
DROP POLICY IF EXISTS "Anyone authenticated can read classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers full access to own classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can read their classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can create classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can update their classes" ON public.classes;
DROP POLICY IF EXISTS "Parents can read linked classes" ON public.classes;

-- Step 2: Drop EVERY policy that exists on parent_class_enrollments table
DROP POLICY IF EXISTS "Teachers can view class enrollments" ON public.parent_class_enrollments;
DROP POLICY IF EXISTS "Parents can manage own enrollments" ON public.parent_class_enrollments;
DROP POLICY IF EXISTS "Parents full access to own enrollments" ON public.parent_class_enrollments;
DROP POLICY IF EXISTS "Teachers read enrollments by teacher check" ON public.parent_class_enrollments;

-- Step 3: Create ONLY the simple, non-circular policies we need

-- ============================================================================
-- CLASSES TABLE - SIMPLE POLICIES
-- ============================================================================

-- Allow teachers full access to their own classes
CREATE POLICY "teacher_own_classes"
  ON public.classes
  FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Allow ANY authenticated user to read classes (needed for parent signup)
CREATE POLICY "authenticated_read_classes"
  ON public.classes
  FOR SELECT
  USING (true);

-- ============================================================================
-- PARENT_CLASS_ENROLLMENTS TABLE - SIMPLE POLICIES
-- ============================================================================

-- Allow parents full access to their own enrollments
CREATE POLICY "parent_own_enrollments"
  ON public.parent_class_enrollments
  FOR ALL
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

-- ============================================================================
-- Done! Verify the policies
-- ============================================================================
SELECT 'Classes policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'classes';

SELECT 'Parent enrollments policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'parent_class_enrollments';
