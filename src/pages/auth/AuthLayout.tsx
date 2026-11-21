import { Zap, ArrowLeft, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTheme } from '@/lib/theme';
import { useRouter } from '@/lib/router';
import { AreaChart } from '@/components/ui/charts/AreaChart';
import { revenueSeries } from '@/lib/mockData';

export function AuthLayout({ children, side }: { children: ReactNode; side: 'left' | 'right' }) {
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className={`relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-12 text-white lg:flex ${side === 'right' ? 'order-2' : ''}`}>
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute bottom-0 -left-16 h-80 w-80 rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="relative">
          <a href="#/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur"><Zap size={18} fill="currentColor" /></span>
            <span className="font-display text-lg font-bold tracking-tight">BizPilot AI</span>
          </a>
        </div>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight">The intelligent operating system for modern commerce.</h2>
          <p className="mt-4 max-w-md text-white/80">Inventory, orders, customers, and finance — unified and supercharged with an AI assistant that actually understands your business.</p>
          <div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Revenue this year</span>
              <span className="font-semibold text-accent-300">+12.4%</span>
            </div>
            <div className="mt-3 text-white">
              <AreaChart data={revenueSeries} height={140} compact />
            </div>
          </div>
        </div>
        <div className="relative text-sm text-white/70">"BizPilot AI replaced four tools for us. The assistant saves me hours every day." <span className="block mt-1 text-white/90">— Priya Sharma, Founder at Atlas Goods</span></div>
      </div>

      {/* Form panel */}
      <div className={`flex flex-col bg-ink-50 dark:bg-ink-950 ${side === 'right' ? 'order-1' : ''}`}>
        <div className="flex items-center justify-between p-6">
          <button onClick={() => navigate('/')} className="btn-ghost -ml-2 text-sm"><ArrowLeft size={16} /> Back</button>
          <button onClick={toggleTheme} className="btn-ghost p-2.5" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
