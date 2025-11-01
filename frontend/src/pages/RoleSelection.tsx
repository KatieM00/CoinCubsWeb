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

type Step = 'role-select' | 'teacher-setup' | 'parent-setup'

export default function RoleSelection() {
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState<Step>('role-select')
  const [isLoading, setIsLoading] = useState(false)

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

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user!.id,
          email: user!.email,
          role: 'teacher',
          full_name: user!.user_metadata.full_name || user!.email
        })

      if (profileError) throw profileError

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
      // Give React time to update state and trigger re-render
      await new Promise(resolve => setTimeout(resolve, 100))
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
    try {
      // Verify class exists
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('class_code', classCode.toUpperCase())
        .single()

      if (classError || !classData) {
        toast.error('Invalid class code. Please check with your teacher.')
        setIsLoading(false)
        return
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user!.id,
          email: user!.email,
          role: 'parent',
          full_name: user!.user_metadata.full_name || user!.email
        })

      if (profileError) throw profileError

      toast.success('Parent account created! You can now view your child\'s progress.')
      await refreshProfile()
      // Give React time to update state and trigger re-render
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error: any) {
      console.error('Error creating parent profile:', error)
      toast.error(error.message || 'Failed to create parent profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'role-select') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to CoinCubs!</h1>
            <p className="text-lg text-muted-foreground">Are you a teacher or a parent?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="bg-white/80 backdrop-blur-sm border-2 border-amber-300 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => setStep('teacher-setup')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">I'm a Teacher</CardTitle>
                <CardDescription className="text-base">
                  Set up your classroom economy and manage student awards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg rounded-full shadow-lg"
                >
                  Continue as Teacher
                </Button>
              </CardContent>
            </Card>

            <Card
              className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => setStep('parent-setup')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">I'm a Parent</CardTitle>
                <CardDescription className="text-base">
                  View your child's progress and classroom activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold py-6 text-lg rounded-full shadow-lg"
                >
                  Continue as Parent
                </Button>
              </CardContent>
            </Card>
          </div>
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
            <p className="text-xs text-muted-foreground">
              Ask your child's teacher for this code
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Next:</strong> After joining, you'll be able to select your child from the class list and view their progress.
            </p>
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
