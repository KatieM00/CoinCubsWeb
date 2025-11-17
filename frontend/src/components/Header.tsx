import { useAuth } from '../hooks/useAuth';
import { useDemo } from '../contexts/DemoContext';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { toast } from 'sonner';
import CubCoinIcon from '@/assets/CubCoin.png';

// Simple icon component using CubCoin image
const Icon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src={CubCoinIcon} alt="" className={className} />
);

export default function Header() {
  const { logout, profile } = useAuth();
  const { isDemoMode, exitDemoMode } = useDemo();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    console.log('🚪 Logout clicked', { isDemoMode });

    if (isDemoMode) {
      exitDemoMode();
      toast.success('Exited demo mode');
      navigate({ to: '/login' });
      return;
    }

    try {
      console.log('🔓 Calling logout...');
      await logout();
      console.log('✅ Logout successful, clearing query cache...');
      queryClient.clear();
      console.log('✅ Cache cleared, navigating to login...');
      toast.success('Logged out successfully');
      // Force navigation to login screen
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#FFF8E7] border-b-2 border-orange-500 sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Icon className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-[#3E2723]">
                  CoinCubs
                </h1>
                <p className="text-[10px] md:text-xs text-[#5D4037] hidden sm:block">Growing Together</p>
              </div>
            </button>

          {/* Desktop Navigation (>1024px) */}
          <nav className="hidden lg:flex items-center gap-2">
            <Button
              variant={currentPath === '/' || currentPath === '/quick-award' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/quick-award')}
              className={`gap-2 h-9 ${currentPath === '/' || currentPath === '/quick-award' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100 hover:text-[#3E2723]'}`}
            >
              ⚡
              Award
            </Button>
            <Button
              variant={currentPath === '/class-display' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/class-display')}
              className={`gap-2 h-9 ${currentPath === '/class-display' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100 hover:text-[#3E2723]'}`}
            >
              🖥️
              Class Display
            </Button>
            <Button
              variant={currentPath === '/lessons' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/lessons')}
              className={`gap-2 h-9 ${currentPath === '/lessons' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100 hover:text-[#3E2723]'}`}
            >
              📚
              Lessons
            </Button>
            <Button
              variant={currentPath === '/class-bank' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/class-bank')}
              className={`gap-2 h-9 ${currentPath === '/class-bank' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100 hover:text-[#3E2723]'}`}
            >
              🏦
              Class Bank
            </Button>
            <Button
              variant={currentPath === '/settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigate('/settings')}
              className={`gap-2 h-9 ${currentPath === '/settings' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100 hover:text-[#3E2723]'}`}
            >
              ⚙️
              Settings
            </Button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Logout/Exit Demo Button */}
            <Button
              onClick={() => {
                console.log('🖱️ BUTTON CLICKED!');
                handleLogout();
              }}
              variant="outline"
              size="sm"
              className="gap-2 h-11 md:h-10 lg:h-9 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent"
            >
              🚪
              <span className="hidden sm:inline">{isDemoMode ? 'Exit Demo' : 'Logout'}</span>
            </Button>

            {/* Mobile Menu Button (<1024px) */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden h-11 md:h-10 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white hover:border-transparent">
                  ☰
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-[#FFF8E7]">
                <div className="flex flex-col gap-4 mt-8">
                  {(isDemoMode || profile) && (
                    <div className="pb-4 border-b border-orange-300">
                      <p className="text-base font-semibold text-[#3E2723]">
                        {isDemoMode ? 'Demo Teacher' : profile?.full_name}
                      </p>
                      <p className="text-sm text-[#8D6E63]">Teacher</p>
                    </div>
                  )}
                  <nav className="flex flex-col gap-2">
                    <Button
                      variant={currentPath === '/' || currentPath === '/quick-award' ? 'default' : 'ghost'}
                      size="lg"
                      onClick={() => handleNavigate('/quick-award')}
                      className={`justify-start gap-3 h-12 ${currentPath === '/' || currentPath === '/quick-award' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100'}`}
                    >
                      ⚡
                      Award
                    </Button>
                    <Button
                      variant={currentPath === '/class-display' ? 'default' : 'ghost'}
                      size="lg"
                      onClick={() => handleNavigate('/class-display')}
                      className={`justify-start gap-3 h-12 ${currentPath === '/class-display' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100'}`}
                    >
                      🖥️
                      Class Display
                    </Button>
                    <Button
                      variant={currentPath === '/lessons' ? 'default' : 'ghost'}
                      size="lg"
                      onClick={() => handleNavigate('/lessons')}
                      className={`justify-start gap-3 h-12 ${currentPath === '/lessons' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100'}`}
                    >
                      📚
                      Lessons
                    </Button>
                    <Button
                      variant={currentPath === '/class-bank' ? 'default' : 'ghost'}
                      size="lg"
                      onClick={() => handleNavigate('/class-bank')}
                      className={`justify-start gap-3 h-12 ${currentPath === '/class-bank' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100'}`}
                    >
                      🏦
                      Class Bank
                    </Button>
                    <Button
                      variant={currentPath === '/settings' ? 'default' : 'ghost'}
                      size="lg"
                      onClick={() => handleNavigate('/settings')}
                      className={`justify-start gap-3 h-12 ${currentPath === '/settings' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'text-[#3E2723] hover:bg-orange-100'}`}
                    >
                      ⚙️
                      Settings
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
