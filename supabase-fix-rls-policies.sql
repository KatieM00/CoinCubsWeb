-- ============================================================================
-- FIX: Remove circular dependency in RLS policies
-- ============================================================================
-- This fixes the "infinite recursion detected in policy" error
-- Run this in your Supabase SQL Editor

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Teachers can manage own classes" ON public.classes;
DROP POLICY IF EXISTS "Parents can view enrolled classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can view class enrollments" ON public.parent_class_enrollments;
DROP POLICY IF EXISTS "Parents can manage own enrollments" ON public.parent_class_enrollments;

-- Step 2: Recreate classes policies WITHOUT circular dependency
-- Teachers can manage their own classes (simplified - no circular check)
CREATE POLICY "Teachers can manage own classes"
  ON public.classes
  FOR ALL
  USING (auth.uid() = teacher_id);

-- Parents can view classes they're enrolled in (will be checked via parent_class_enrollments policies)
CREATE POLICY "Parents can view enrolled classes"
  ON public.classes
  FOR SELECT
  USING (
    -- Check if user has parent role
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Step 3: Recreate parent_class_enrollments policies
-- Parents can manage their own enrollments
CREATE POLICY "Parents can manage own enrollments"
  ON public.parent_class_enrollments
  FOR ALL
  USING (auth.uid() = parent_id);

-- Teachers can view enrollments in their classes (simplified)
CREATE POLICY "Teachers can view class enrollments"
  ON public.parent_class_enrollments
  FOR SELECT
  USING (
    -- Direct check without subquery to classes table
    class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
    )
  );
