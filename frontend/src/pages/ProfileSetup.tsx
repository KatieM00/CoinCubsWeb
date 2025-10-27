import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../backend';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.admin);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim(), role });
      toast.success('Welcome to CoinCubs!');
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-amber-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Welcome to CoinCubs!
          </CardTitle>
          <CardDescription className="text-base">
            Let's set up your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                What's your name?
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">I am a...</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                  <RadioGroupItem value={UserRole.admin} id="teacher" />
                  <Label htmlFor="teacher" className="flex-1 cursor-pointer text-base">
                    Teacher
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                  <RadioGroupItem value={UserRole.user} id="parent" />
                  <Label htmlFor="parent" className="flex-1 cursor-pointer text-base">
                    Parent
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Setting up...
                </>
              ) : (
                'Get Started'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
