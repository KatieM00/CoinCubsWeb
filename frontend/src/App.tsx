import RoleSelection from './pages/RoleSelection';
import { useAuth } from './hooks/useAuth';
import { DemoProvider, useDemo } from './contexts/DemoContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import ParentHeader from './components/ParentHeader';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';
import QuickAwardPage from './pages/QuickAwardPage';
import ClassDisplayPage from './pages/ClassDisplayPage';
import LessonsPage from './pages/LessonsPage';
import SettingsPage from './pages/SettingsPage';
import ParentPortalPage from './pages/ParentPortalPage';

function TeacherLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ParentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ParentHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootLayoutComponent() {
  const { profile } = useAuth();
  const { isDemoMode, demoRole } = useDemo();

  // In demo mode, use demo role; otherwise use profile role
  const isTeacher = isDemoMode ? demoRole === 'teacher' : profile?.role === 'teacher';

  return isTeacher ? <TeacherLayout /> : <ParentLayout />;
}

function IndexComponent() {
  const { profile } = useAuth();
  const { isDemoMode, demoRole } = useDemo();

  // In demo mode, use demo role; otherwise use profile role
  const isTeacher = isDemoMode ? demoRole === 'teacher' : profile?.role === 'teacher';

  return isTeacher ? <QuickAwardPage /> : <ParentPortalPage />;
}

const rootRoute = createRootRoute({
  component: RootLayoutComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const quickAwardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quick-award',
  component: QuickAwardPage,
});

const classDisplayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/class-display',
  component: ClassDisplayPage,
});

const lessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons',
  component: LessonsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const parentPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent-portal',
  component: ParentPortalPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  quickAwardRoute,
  classDisplayRoute,
  lessonsRoute,
  settingsRoute,
  parentPortalRoute,
]);

const router = createRouter({ routeTree });

function AppContent() {
  const { user, profile, isLoading } = useAuth();
  const { isDemoMode } = useDemo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">Loading CoinCubs...</p>
        </div>
      </div>
    );
  }

  // Demo mode: skip authentication, go straight to app
  if (isDemoMode) {
    return (
      <>
        <RouterProvider router={router} />
        <Toaster />
      </>
    );
  }

  // Regular mode: check authentication step by step
  const isAuthenticated = !!user;
  const hasProfile = !!profile;

  // Step 1: Not authenticated → show login screen
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  }

  // Step 2: Authenticated but no profile → show role selection
  if (isAuthenticated && !hasProfile) {
    return (
      <>
        <RoleSelection />
        <Toaster />
      </>
    );
  }

  // Step 3: Authenticated with profile → show main app
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DemoProvider>
        <AppContent />
      </DemoProvider>
    </ThemeProvider>
  );
}
