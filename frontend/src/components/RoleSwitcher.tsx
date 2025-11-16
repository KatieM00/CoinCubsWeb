import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Simple icon component using CubCoin image

export default function RoleSwitcher() {
  const { profiles, activeRole, switchRole } = useAuth()

  if (profiles.length <= 1) {
    return null // Don't show switcher if user only has one role
  }

  const hasTeacher = profiles.some(p => p.role === 'teacher')
  const hasParent = profiles.some(p => p.role === 'parent')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground">
            You have both Teacher and Parent access. Which would you like to view?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {hasTeacher && (
            <Card
              className={`bg-white/80 backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer ${
                activeRole === 'teacher' ? 'border-amber-500 ring-2 ring-amber-300' : 'border-amber-300'
              }`}
              onClick={() => switchRole('teacher')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎓</span>
                </div>
                <CardTitle className="text-2xl">Teacher</CardTitle>
                <CardDescription>Manage your classroom and award students</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    switchRole('teacher')
                  }}
                >
                  View as Teacher
                </Button>
              </CardContent>
            </Card>
          )}

          {hasParent && (
            <Card
              className={`bg-white/80 backdrop-blur-sm border-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer ${
                activeRole === 'parent' ? 'border-blue-500 ring-2 ring-blue-300' : 'border-blue-300'
              }`}
              onClick={() => switchRole('parent')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👨‍👩‍👧</span>
                </div>
                <CardTitle className="text-2xl">Parent</CardTitle>
                <CardDescription>View your child's learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    switchRole('parent')
                  }}
                >
                  View as Parent
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You can switch between roles at any time from your profile settings
        </p>
      </div>
    </div>
  )
}
