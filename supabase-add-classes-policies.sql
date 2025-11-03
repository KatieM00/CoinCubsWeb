-- ============================================================================
-- Add the missing classes table policies
-- ============================================================================

-- First, let's check if policies already exist
SELECT 'Existing classes policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'classes';

-- Drop any existing policies on classes (just to be safe)
DROP POLICY IF EXISTS "teacher_own_classes" ON public.classes;
DROP POLICY IF EXISTS "authenticated_read_classes" ON public.classes;

-- Create the classes policies
-- Policy 1: Teachers can manage their own classes
CREATE POLICY "teacher_own_classes"
  ON public.classes
  FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Policy 2: Anyone authenticated can read classes
CREATE POLICY "authenticated_read_classes"
  ON public.classes
  FOR SELECT
  USING (true);

-- Verify they were created
SELECT 'New classes policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'classes';
