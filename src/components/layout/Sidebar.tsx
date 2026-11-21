import {
  LayoutDashboard, Package, ShoppingCart, Users, Wallet, Sparkles, BarChart3, Settings,
  X, Zap,
} from 'lucide-react';
import { navItems, isActive, cxNav } from '@/components/nav';
import { useRouter } from '@/lib/router';
import { cx } from '@/lib/format';

const icons: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  inventory: Package,
  orders: ShoppingCart,
  customers: Users,
  finance: Wallet,
  assistant: Sparkles,
  reports: BarChart3,
  settings: Settings,
};

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { path, navigate } = useRouter();

  return (
    <>
      <div
        className={cx(
          'fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-200/70 bg-white transition-transform duration-300 dark:border-ink-800/60 dark:bg-ink-900 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <a href="#/" className="flex items-center gap-2.5" onClick={() => navigate('/')}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <Zap size={18} fill="currentColor" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-white">BizPilot<span className="text-brand-500"> AI</span></span>
          </a>
          <button onClick={onClose} className="btn-ghost -mr-2 p-2 lg:hidden"><X size={18} /></button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Workspace</p>
          {navItems.map((item) => {
            const Icon = icons[item.key];
            const active = isActive(path, item.href);
            const isAssistant = item.key === 'assistant';
            return (
              <a
                key={item.key}
                href={`#${item.href}`}
                onClick={(e) => { e.preventDefault(); navigate(item.href); onClose(); }}
                className={cxNav(active)}
              >
                <Icon size={18} className={isAssistant ? 'text-brand-500' : ''} />
                <span className="flex-1">{item.label}</span>
                {isAssistant && <span className="badge bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">AI</span>}
              </a>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl2 bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white shadow-pop">
          <p className="font-display text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-white/80">Unlock advanced AI forecasting and unlimited reports.</p>
          <button onClick={() => navigate('/app/settings')} className="mt-3 w-full rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/25">
            Explore plans
          </button>
        </div>
      </aside>
    </>
  );
}
