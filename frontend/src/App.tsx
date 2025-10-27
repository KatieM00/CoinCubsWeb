import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import ParentHeader from './components/ParentHeader';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';
import ProfileSetup from './pages/ProfileSetup';
import QuickAwardPage from './pages/QuickAwardPage';
import ClassDisplayPage from './pages/ClassDisplayPage';
import LessonsPage from './pages/LessonsPage';
import SettingsPage from './pages/SettingsPage';
import ParentPortalPage from './pages/ParentPortalPage';
import { UserRole } from './backend';

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
  const { data: userProfile } = useGetCallerUserProfile();
  const isTeacher = userProfile?.role === UserRole.admin;
  
  return isTeacher ? <TeacherLayout /> : <ParentLayout />;
}

function IndexComponent() {
  const { data: userProfile } = useGetCallerUserProfile();
  const isTeacher = userProfile?.role === UserRole.admin;
  
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

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-medium text-muted-foreground">Loading CoinCubs...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LoginScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ProfileSetup />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
