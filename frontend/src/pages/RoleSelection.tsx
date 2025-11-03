// @ts-nocheck
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Users, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

type Step = 'role-select' | 'teacher-setup' | 'parent-setup'

export default function RoleSelection() {
  const { user, profiles, refreshProfile, switchRole } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('role-select')
  const [isLoading, setIsLoading] = useState(false)

  // Check if user already has roles
  const hasTeacherRole = profiles.some(p => p.role === 'teacher')
  const hasParentRole = profiles.some(p => p.role === 'parent')

  // Teacher setup state
  const [className, setClassName] = useState('')
  const [schoolYear, setSchoolYear] = useState('')

  // Parent setup state
  const [classCode, setClassCode] = useState('')

  // Safety check: if no user, show error (AFTER all hooks are declared)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be signed in to set up your profile. Please reload the page and sign in.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const generateClassCode = () => {
    const adjectives = ['LIONS', 'TIGERS', 'BEARS', 'EAGLES', 'DRAGONS', 'PANDAS', 'WOLVES']
    const year = new Date().getFullYear()
    const random = adjectives[Math.floor(Math.random() * adjectives.length)]
    return `${random}-${year}`
  }

  const handleTeacherSetup = async () => {
    if (!className.trim()) {
      toast.error('Please enter a class name')
      return
    }

    setIsLoading(true)
    try {
      const classCode = generateClassCode()

      // Check if teacher profile already exists
      if (!hasTeacherRole) {
        // Create teacher profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user!.id,
            email: user!.email,
            role: 'teacher',
            full_name: user!.user_metadata.full_name || user!.email
          })

        if (profileError) throw profileError
      }

      // Create class
      const { error: classError } = await supabase
        .from('classes')
        .insert({
          teacher_id: user!.id,
          class_name: className,
          class_code: classCode,
          school_year: schoolYear || null
        })

      if (classError) throw classError

      toast.success(`Class created! Your class code is: ${classCode}`, { duration: 5000 })
      await refreshProfile()
      // Switch to teacher role and navigate to home
      switchRole('teacher')
      // Give React time to update state
      await new Promise(resolve => setTimeout(resolve, 100))
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Error creating teacher profile:', error)
      toast.error(error.message || 'Failed to create teacher profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleParentSetup = async () => {
    if (!classCode.trim()) {
      toast.error('Please enter a class code')
      return
    }

    setIsLoading(true)
    console.log('👶 Parent signup starting with class code:', classCode.toUpperCase());

    try {
      // Verify class exists
      console.log('🔍 Looking up class by code...');
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('class_code', classCode.toUpperCase())
        .single()

      console.log('📊 Class lookup result:', { hasData: !!classData, hasError: !!classError, classData, classError });

      if (classError || !classData) {
        console.error('❌ Class not found or error:', classError);
        toast.error('Invalid class code. Please check with your teacher.')
        setIsLoading(false)
        return
      }

      console.log('✅ Class found! ID:', classData.id);

      // Check if parent profile already exists
      if (!hasParentRole) {
        // Create parent profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user!.id,
            email: user!.email,
            role: 'parent',
            full_name: user!.user_metadata.full_name || user!.email
          })

        if (profileError) throw profileError
      }

      // Create or update parent-class enrollment
      const { error: enrollmentError } = await supabase
        .from('parent_class_enrollments')
        .upsert({
          parent_id: user!.id,
          class_id: classData.id
        })

      if (enrollmentError) {
        console.error('Error creating enrollment:', enrollmentError)
      }

      toast.success(hasParentRole ? 'Joined class successfully!' : 'Parent account created! You can now view your child\'s progress.')
      await refreshProfile()
      // Switch to parent role and navigate to home
      switchRole('parent')
      // Give React time to update state
      await new Promise(resolve => setTimeout(resolve, 100))
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Error creating parent profile:', error)
      toast.error(error.message || 'Failed to create parent profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'role-select') {
    // Check if user already has roles
    const existingRoles = [];
    if (hasTeacherRole) existingRoles.push('Teacher');
    if (hasParentRole) existingRoles.push('Parent');

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {existingRoles.length > 0 ? 'Add Another Role?' : 'Welcome to CoinCubs!'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {existingRoles.length > 0
                ? `You already have ${existingRoles.join(' and ')} access. Add another role or continue.`
                : 'Are you a teacher or a parent?'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={`bg-white/80 backdrop-blur-sm border-2 shadow-xl transition-all ${
                hasTeacherRole
                  ? 'border-green-300 opacity-75'
                  : 'border-amber-300 hover:shadow-2xl cursor-pointer'
              }`}
              onClick={() => !hasTeacherRole && setStep('teacher-setup')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">
                  {hasTeacherRole ? '✓ Teacher Account' : 'I\'m a Teacher'}
                </CardTitle>
                <CardDescription className="text-base">
                  {hasTeacherRole
                    ? 'You already have teacher access'
                    : 'Set up your classroom economy and manage student awards'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  disabled={hasTeacherRole}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg rounded-full shadow-lg disabled:opacity-50"
                >
                  {hasTeacherRole ? 'Already Added' : 'Continue as Teacher'}
                </Button>
              </CardContent>
            </Card>

            <Card
              className={`bg-white/80 backdrop-blur-sm border-2 shadow-xl transition-all ${
                hasParentRole
                  ? 'border-green-300 opacity-75'
                  : 'border-blue-300 hover:shadow-2xl cursor-pointer'
              }`}
              onClick={() => !hasParentRole && setStep('parent-setup')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">
                  {hasParentRole ? '✓ Parent Account' : 'I\'m a Parent'}
                </CardTitle>
                <CardDescription className="text-base">
                  {hasParentRole
                    ? 'You already have parent access'
                    : 'View your child\'s progress and classroom activities'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  disabled={hasParentRole}
                  variant="outline"
                  className="w-full border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold py-6 text-lg rounded-full shadow-lg disabled:opacity-50"
                >
                  {hasParentRole ? 'Already Added' : 'Continue as Parent'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Show "Continue to App" button if user already has at least one role */}
          {existingRoles.length > 0 && (
            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => {
                  // Set active role to first available role before continuing
                  const firstRole = hasTeacherRole ? 'teacher' : 'parent';
                  switchRole(firstRole);
                  // State update will cause App.tsx to re-render and show main app
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-12 py-6 text-lg rounded-full shadow-lg"
              >
                Continue to CoinCubs →
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (step === 'teacher-setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('role-select')}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl">Set Up Your Class</CardTitle>
            <CardDescription>Create your classroom economy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name *</Label>
              <Input
                id="className"
                placeholder="e.g., Mrs. Smith's 3rd Grade"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolYear">School Year (optional)</Label>
              <Input
                id="schoolYear"
                placeholder="e.g., 2024-2025"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Next:</strong> You'll receive a unique class code to share with parents so they can view their child's progress.
              </p>
            </div>

            <Button
              onClick={handleTeacherSetup}
              disabled={isLoading || !className.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              size="lg"
            >
              {isLoading ? 'Creating...' : 'Create Class'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // parent-setup
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('role-select')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl">Join Your Child's Class</CardTitle>
          <CardDescription>Enter the class code from your child's teacher</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classCode">Class Code *</Label>
            <Input
              id="classCode"
              placeholder="e.g., LIONS-2025"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              className="uppercase"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-2">How to get your class code:</p>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>Ask your child's teacher for the class code</li>
                <li>Teachers receive this code when they set up their classroom</li>
                <li>The code format is: ANIMAL-YEAR (e.g., LIONS-2025)</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>After joining:</strong> You'll be able to view your child's progress, class achievements, and stay connected with classroom activities.
              </p>
            </div>
          </div>

          <Button
            onClick={handleParentSetup}
            disabled={isLoading || !classCode.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            size="lg"
          >
            {isLoading ? 'Joining...' : 'Join Class'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
