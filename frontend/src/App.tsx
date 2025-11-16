import { useEffect } from 'react';
import RoleSelection from './pages/RoleSelection';
import { useAuth, AuthProvider } from './hooks/useAuth';
import { DemoProvider, useDemo } from './contexts/DemoContext';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, useNavigate } from '@tanstack/react-router';
import Header from './components/Header';
import ParentHeader from './components/ParentHeader';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';
import RoleSwitcher from './components/RoleSwitcher';
import QuickAwardPage from './pages/QuickAwardPage';
import ClassDisplayPage from './pages/ClassDisplayPage';
import LessonsPage from './pages/LessonsPage';
import LessonNotesPage from './pages/LessonNotesPage';
// Import SettingsPage directly (not lazy loaded) to avoid chunk initialization issues
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
  const { profile, activeRole } = useAuth();
  const { isDemoMode, demoRole } = useDemo();

  // In demo mode, use demo role; otherwise use activeRole
  const isTeacher = isDemoMode ? demoRole === 'teacher' : activeRole === 'teacher';

  console.log('🏠 IndexComponent rendering:', {
    isDemoMode,
    demoRole,
    profileRole: profile?.role,
    activeRole,
    isTeacher,
    willShow: isTeacher ? 'QuickAwardPage (Teacher)' : 'ParentPortalPage (Parent)'
  });

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

function ProtectedQuickAwardPage() {
  const { activeRole } = useAuth();
  const { isDemoMode, demoRole } = useDemo();
  const navigate = useNavigate();

  // In demo mode, use demo role; otherwise use activeRole
  const isTeacher = isDemoMode ? demoRole === 'teacher' : activeRole === 'teacher';

  useEffect(() => {
    // Redirect parents to parent portal
    if (!isTeacher) {
      navigate({ to: '/parent-portal', replace: true });
    }
  }, [isTeacher, navigate]);

  // Don't render anything while redirecting
  if (!isTeacher) {
    return null;
  }

  return <QuickAwardPage />;
}

const quickAwardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quick-award',
  component: ProtectedQuickAwardPage,
});

function ProtectedTeacherRoute({ children }: { children: React.ReactNode }) {
  const { activeRole } = useAuth();
  const { isDemoMode, demoRole } = useDemo();
  const navigate = useNavigate();

  // In demo mode, use demo role; otherwise use activeRole
  const isTeacher = isDemoMode ? demoRole === 'teacher' : activeRole === 'teacher';

  useEffect(() => {
    // Redirect parents to parent portal
    if (!isTeacher) {
      navigate({ to: '/parent-portal', replace: true });
    }
  }, [isTeacher, navigate]);

  // Don't render anything while redirecting
  if (!isTeacher) {
    return null;
  }

  return <>{children}</>;
}

const classDisplayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/class-display',
  component: () => (
    <ProtectedTeacherRoute>
      <ClassDisplayPage />
    </ProtectedTeacherRoute>
  ),
});

const lessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons',
  component: () => (
    <ProtectedTeacherRoute>
      <LessonsPage />
    </ProtectedTeacherRoute>
  ),
});

const lessonNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lesson-notes',
  component: () => (
    <ProtectedTeacherRoute>
      <LessonNotesPage />
    </ProtectedTeacherRoute>
  ),
});

// Wrapper to pass auth profile as prop to avoid circular dependency
function SettingsPageWrapper() {
  const { profile } = useAuth();
  return <SettingsPage profile={profile} />;
}

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <ProtectedTeacherRoute>
      <SettingsPageWrapper />
    </ProtectedTeacherRoute>
  ),
});

const parentPortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent-portal',
  component: ParentPortalPage,
});

// Auth callback route - redirects to home after OAuth
const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: () => {
    const navigate = useNavigate();
    useEffect(() => {
      // Redirect to home after OAuth callback
      navigate({ to: '/', replace: true });
    }, [navigate]);
    return null;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  quickAwardRoute,
  classDisplayRoute,
  lessonsRoute,
  lessonNotesRoute,
  settingsRoute,
  parentPortalRoute,
  authCallbackRoute,
]);

const router = createRouter({ routeTree });

function AppContent() {
  const { user, profile, profiles, hasMultipleRoles, activeRole, isLoading, isLoadingProfiles } = useAuth();
  const { isDemoMode } = useDemo();

  // Debug logging
  console.log('🔍 App State:', {
    isLoading,
    isLoadingProfiles,
    isDemoMode,
    hasUser: !!user,
    hasProfile: !!profile,
    profilesCount: profiles.length,
    user,
    profile
  });

  if (isLoading || isLoadingProfiles) {
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
    console.log('✅ Demo mode active - showing app');
    return (
      <>
        <RouterProvider router={router} />
        <Toaster />
      </>
    );
  }

  // Regular mode: check authentication step by step
  const isAuthenticated = !!user;

  // Step 1: Not authenticated → show login screen
  if (!isAuthenticated) {
    console.log('🔐 Not authenticated - showing LoginScreen');
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  }

  // Step 2: Authenticated but no profile → show role selection
  if (isAuthenticated && profiles.length === 0) {
    console.log('👤 Authenticated but no profile - showing RoleSelection');
    return (
      <>
        <RoleSelection />
        <Toaster />
      </>
    );
  }

  // Step 2.5: Authenticated with profile(s) but no active role selected
  if (isAuthenticated && profiles.length > 0 && !activeRole) {
    console.log('🔍 Step 2.5 check:', {
      profiles: profiles.length,
      activeRole,
      hasMultipleRoles
    });

    // If only one role, show RoleSelection (they can add another or continue)
    if (profiles.length === 1) {
      console.log('👤 User has 1 role but no active role - showing RoleSelection');
      return (
        <>
          <RoleSelection />
          <Toaster />
        </>
      );
    }
    // If multiple roles, show RoleSwitcher to choose
    if (hasMultipleRoles) {
      console.log('🔄 Multiple roles but no active role - showing RoleSwitcher');
      return (
        <>
          <RoleSwitcher />
          <Toaster />
        </>
      );
    }
  }

  // Step 3: Authenticated with profile and active role → show main app
  console.log('✅ Fully authenticated - showing main app', {
    activeRole,
    profile: profile?.role,
    profiles: profiles.length
  });
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </DemoProvider>
    </ThemeProvider>
  );
}
