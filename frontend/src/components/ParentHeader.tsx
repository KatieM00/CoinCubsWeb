import { useAuth } from '../hooks/useAuth';
import { useDemo } from '../contexts/DemoContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CubCoinIcon from '@/assets/CubCoin.png';

// Simple icon component using CubCoin image
const Icon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={CubCoinIcon} alt="" className={className} />
);

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
    <header className="bg-[#5D4037] border-b border-[#3E2723] sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#E8C391] to-[#DDB76F] rounded-full flex items-center justify-center shadow-lg">
                <Icon className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-[#FFF8E7]">
                  CoinCubs
                </h1>
                <p className="text-[10px] md:text-xs text-[#E8C391]">Parent Portal</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-4">
              {(isDemoMode || profile) && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-[#FFF8E7]">
                    {isDemoMode ? 'Demo Parent' : profile?.full_name}
                  </p>
                  <p className="text-xs text-[#E8C391]">Parent</p>
                </div>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 h-11 md:h-10 lg:h-9 border-[#E8C391] text-[#FFF8E7] hover:bg-[#E8C391] hover:text-[#3E2723]">
                🚪
                <span className="hidden sm:inline">{isDemoMode ? 'Exit Demo' : 'Logout'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
  );
}
