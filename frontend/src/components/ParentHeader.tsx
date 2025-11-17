import { useAuth } from '../hooks/useAuth';
import { useDemo } from '../contexts/DemoContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import LogoLongCl from '@/assets/LogoLongCl.png';

export default function ParentHeader() {
  const { logout, profile } = useAuth();
  const { isDemoMode, exitDemoMode } = useDemo();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    if (isDemoMode) {
      exitDemoMode();
      toast.success('Exited demo mode');
      return;
    }

    try {
      await logout();
      queryClient.clear();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="bg-[#FFF8E7] border-b-2 border-orange-500 sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img src={LogoLongCl} alt="CoinCubs" className="h-10 md:h-12 lg:h-14 w-auto" />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-4">
              {(isDemoMode || profile) && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-[#3E2723]">
                    {isDemoMode ? 'Demo Parent' : profile?.full_name}
                  </p>
                  <p className="text-xs text-[#5D4037]">Parent</p>
                </div>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 h-11 md:h-10 lg:h-9 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent">
                🚪
                <span className="hidden sm:inline">{isDemoMode ? 'Exit Demo' : 'Logout'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
  );
}
