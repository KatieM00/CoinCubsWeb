-- ============================================================================
-- FIX V2: Allow class code lookup during parent signup
-- ============================================================================
-- This allows parents to look up classes by code BEFORE they have a parent profile
-- Run this in your Supabase SQL Editor

-- Drop all existing policies on classes
DROP POLICY IF EXISTS "Teachers can manage own classes" ON public.classes;
DROP POLICY IF EXISTS "Parents can view enrolled classes" ON public.classes;

-- Recreate classes policies with proper access
-- 1. Teachers can manage their own classes
CREATE POLICY "Teachers can manage own classes"
  ON public.classes
  FOR ALL
  USING (auth.uid() = teacher_id);

-- 2. Anyone authenticated can SELECT classes (needed for parent signup to verify class codes)
-- This is safe because classes table only contains non-sensitive info (class names, codes)
CREATE POLICY "Authenticated users can view classes"
  ON public.classes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Note: We removed the restrictive parent policy that was blocking signup.
-- Parents can view ALL classes (just read-only), which is needed for the class code lookup.
-- Only teachers can INSERT/UPDATE/DELETE their own classes.
