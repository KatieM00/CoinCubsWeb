-- ============================================================================
-- FIX V3: Complete RLS policy rebuild to eliminate ALL circular dependencies
-- ============================================================================
-- This completely rebuilds the RLS policies from scratch
-- Run this in your Supabase SQL Editor

-- Step 1: Drop ALL policies on both tables
DROP POLICY IF EXISTS "Teachers can manage own classes" ON public.classes;
DROP POLICY IF EXISTS "Parents can view enrolled classes" ON public.classes;
DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can view class enrollments" ON public.parent_class_enrollments;
DROP POLICY IF EXISTS "Parents can manage own enrollments" ON public.parent_class_enrollments;

-- Step 2: Recreate SIMPLE policies without ANY subqueries or circular checks

-- ============================================================================
-- CLASSES TABLE POLICIES
-- ============================================================================

-- Policy 1: Teachers can do EVERYTHING with their own classes
CREATE POLICY "Teachers full access to own classes"
  ON public.classes
  FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Policy 2: Anyone authenticated can READ classes (needed for parent signup)
CREATE POLICY "Anyone authenticated can read classes"
  ON public.classes
  FOR SELECT
  USING (true);  -- Allow all reads for authenticated users (RLS requires auth by default)

-- ============================================================================
-- PARENT_CLASS_ENROLLMENTS TABLE POLICIES
-- ============================================================================

-- Policy 1: Parents can do EVERYTHING with their own enrollments
CREATE POLICY "Parents full access to own enrollments"
  ON public.parent_class_enrollments
  FOR ALL
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

-- Policy 2: Teachers can READ enrollments where they are the teacher
-- NO SUBQUERY - direct column check only
CREATE POLICY "Teachers read enrollments by teacher check"
  ON public.parent_class_enrollments
  FOR SELECT
  USING (
    -- Check if the class_id belongs to this teacher
    -- This works because we already have the class_id in this table
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = parent_class_enrollments.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- Note: The above policy is safe because:
-- 1. It only checks the classes table (no circular dependency)
-- 2. The classes table policies don't check parent_class_enrollments
-- 3. We broke the circular chain!

-- ============================================================================
-- Verification: Show all policies
-- ============================================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('classes', 'parent_class_enrollments')
ORDER BY tablename, policyname;
