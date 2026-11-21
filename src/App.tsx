import { ThemeProvider } from '@/lib/theme';
import { AuthProvider, useAuth } from '@/lib/auth';
import { RouterProvider, useRouter } from '@/lib/router';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { FinancePage } from '@/pages/FinancePage';
import { AssistantPage } from '@/pages/AssistantPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Zap } from 'lucide-react';

function Routes() {
  const { path } = useRouter();
  const { isAuthenticated, loading } = useAuth();

  if (path === '/' || path === '') return <LandingPage />;
  if (path === '/login') return <LoginPage />;
  if (path === '/signup') return <SignupPage />;

  if (path.startsWith('/app')) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink-50 dark:bg-ink-950">
          <div className="flex flex-col items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft animate-pulse-soft">
              <Zap size={24} fill="currentColor" />
            </span>
            <p className="text-sm text-ink-400">Loading your workspace…</p>
          </div>
        </div>
      );
    }
    if (!isAuthenticated) return <LoginPage />;
    switch (path) {
      case '/app': return <DashboardPage />;
      case '/app/inventory': return <InventoryPage />;
      case '/app/orders': return <OrdersPage />;
      case '/app/customers': return <CustomersPage />;
      case '/app/finance': return <FinancePage />;
      case '/app/assistant': return <AssistantPage />;
      case '/app/reports': return <ReportsPage />;
      case '/app/settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <Routes />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
