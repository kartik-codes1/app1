import { useState } from 'react';
import { Menu, Search, Bell, Moon, Sun, ChevronDown, LogOut, Settings as SettingsIcon, UserCircle } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { Avatar } from '@/components/ui/Avatar';
import { cx } from '@/lib/format';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200/70 glass px-4 dark:border-ink-800/60 sm:px-6">
      <button onClick={onMenu} className="btn-ghost p-2 lg:hidden"><Menu size={20} /></button>

      <div className="relative hidden flex-1 sm:block">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          placeholder="Search orders, products, customers…"
          className="input-base h-10 max-w-md pl-9"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-400 dark:border-ink-700 dark:bg-ink-800 md:block">⌘K</kbd>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 sm:flex-none">
        <button onClick={toggleTheme} className="btn-ghost p-2.5" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="btn-ghost relative p-2.5" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-ink-900" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-ink-100 dark:hover:bg-ink-800"
          >
            <Avatar initials={user?.avatarInitials ?? 'U'} size="sm" />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-ink-800 dark:text-ink-100">{user?.name}</span>
              <span className="block text-xs text-ink-400">{user?.role}</span>
            </span>
            <ChevronDown size={15} className="text-ink-400" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right animate-fade-in rounded-xl2 border border-ink-200 bg-white p-1.5 shadow-pop dark:border-ink-800 dark:bg-ink-900">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{user?.name}</p>
                  <p className="truncate text-xs text-ink-400">{user?.email}</p>
                </div>
                <div className="my-1 h-px bg-ink-100 dark:bg-ink-800" />
                <button onClick={() => { setMenuOpen(false); navigate('/app/settings'); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                  <SettingsIcon size={16} /> Settings
                </button>
                <button onClick={() => { setMenuOpen(false); navigate('/app/settings'); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                  <UserCircle size={16} /> Profile
                </button>
                <div className="my-1 h-px bg-ink-100 dark:bg-ink-800" />
                <button onClick={() => { setMenuOpen(false); signOut().then(() => navigate('/')); }} className={cx('flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10')}>
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
