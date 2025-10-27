import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, GraduationCap } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-2xl mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Welcome to CoinCubs
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Growing Together, Achieving Together</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A classroom economy where every student helps the whole class succeed
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-amber-300 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">I'm a Teacher</CardTitle>
              <CardDescription className="text-base">
                Manage your classroom economy and award ClassGems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Teacher Login
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-300 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">I'm a Parent</CardTitle>
              <CardDescription className="text-base">
                View your child's progress and class activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                variant="outline"
                className="w-full border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Parent Login
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Secure login powered by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
