import { useAuth } from '../hooks/useAuth'
import { useDemo } from '../contexts/DemoContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { isSupabaseConfigured } from '@/lib/supabase'
import CubCoinIcon from '@/assets/CubCoin.png'

// Simple icon component using CubCoin image
const Icon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={CubCoinIcon} alt="" className={className} />
)

export default function LoginScreen() {
  const { loginWithGoogle, isLoading } = useAuth()
  const { enterDemoMode } = useDemo()

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 relative">
      {/* Demo Button - Top Right Corner */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white">
              🧪
              <span className="hidden sm:inline">Demo</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => enterDemoMode('teacher')} className="cursor-pointer">
              <span className="mr-2">🎓</span>
              Demo as Teacher
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => enterDemoMode('parent')} className="cursor-pointer">
              <span className="mr-2">👨‍👩‍👧</span>
              Demo as Parent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-2xl mb-6">
            <Icon className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Welcome to CoinCubs
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Growing Together, Achieving Together</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A classroom economy where every student helps the whole class succeed
          </p>
        </div>

        {!isSupabaseConfigured && (
          <Alert variant="destructive" className="max-w-2xl mx-auto mb-6">
            <span className="mr-2">⚠️</span>
            <AlertDescription>
              <strong>Setup Required:</strong> Supabase environment variables are not configured.
              Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Netlify environment variables.
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-300 shadow-xl hover:shadow-2xl transition-shadow max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
              <span className="text-2xl -ml-2">👨‍👩‍👧</span>
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription className="text-base">
              Teachers and Parents both use Google sign-in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              size="lg"
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 font-semibold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              After signing in, you'll choose whether you're a teacher or parent
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
