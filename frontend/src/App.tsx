import RoleSelection from './pages/RoleSelection';
import { useAuth } from './hooks/useAuth';
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
  const isTeacher = profile?.role === 'teacher';

  return isTeacher ? <TeacherLayout /> : <ParentLayout />;
}

function IndexComponent() {
  const { profile } = useAuth();
  const isTeacher = profile?.role === 'teacher';

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
  const { user, profile, isLoading } = useAuth();

  const isAuthenticated = !!user;

  if (isLoading) {
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

  if (isAuthenticated && !profile) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RoleSelection />
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
