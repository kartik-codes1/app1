import {
  Zap, ArrowRight, Check, BarChart3, ShoppingCart, Package, Users, Wallet,
  Sparkles, Shield, Globe, Menu, X, Moon, Sun, Star,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/lib/theme';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AreaChart } from '@/components/ui/charts/AreaChart';
import { revenueSeries } from '@/lib/mockData';
import { cx } from '@/lib/format';

const features = [
  { icon: Package, title: 'Smart Inventory', desc: 'Real-time stock levels, automatic reorder alerts, and supplier tracking across every warehouse.' },
  { icon: ShoppingCart, title: 'Order Management', desc: 'Process, fulfill, and track orders from web, POS, marketplaces, and wholesale in one place.' },
  { icon: Users, title: 'Customer 360', desc: 'Segmentation, lifetime value, and engagement signals so you know exactly who matters most.' },
  { icon: Wallet, title: 'Finance Dashboard', desc: 'Cash flow, margins, and expenses unified with bank-grade reconciliation and reporting.' },
  { icon: Sparkles, title: 'AI Business Assistant', desc: 'Ask anything about your business and get instant, data-grounded answers and forecasts.' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Beautiful, exportable reports that turn raw data into decisions your team can act on.' },
];

const plans = [
  { name: 'Starter', price: '$0', period: '/mo', desc: 'For new businesses finding their feet', features: ['Up to 500 orders/mo', '1 user', 'Core dashboard', 'Email support'], cta: 'Start free', highlight: false },
  { name: 'Growth', price: '$49', period: '/mo', desc: 'For scaling commerce brands', features: ['Unlimited orders', '10 users', 'AI Assistant', 'Advanced reports', 'Priority support'], cta: 'Start 14-day trial', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For high-volume operations', features: ['Everything in Growth', 'Unlimited users', 'Dedicated manager', 'Custom integrations', 'SLA & security review'], cta: 'Contact sales', highlight: false },
];

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink-200/60 glass dark:border-ink-800/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="#/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
              <Zap size={18} fill="currentColor" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-white">BizPilot<span className="text-brand-500"> AI</span></span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-ink-600 transition hover:text-ink-900 dark:text-ink-300 dark:hover:text-white">Features</a>
            <a href="#pricing" className="text-sm font-medium text-ink-600 transition hover:text-ink-900 dark:text-ink-300 dark:hover:text-white">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-ink-600 transition hover:text-ink-900 dark:text-ink-300 dark:hover:text-white">Customers</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost p-2.5" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate('/login')}>Sign in</Button>
            <Button className="hidden sm:inline-flex" onClick={() => navigate('/signup')}>Get started <ArrowRight size={16} /></Button>
            <button onClick={() => setMobileOpen((o) => !o)} className="btn-ghost p-2.5 md:hidden">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-ink-200/60 px-4 py-4 dark:border-ink-800/60 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink-600 dark:text-ink-300">Features</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink-600 dark:text-ink-300">Pricing</a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink-600 dark:text-ink-300">Customers</a>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/login')}>Sign in</Button>
                <Button className="flex-1" onClick={() => navigate('/signup')}>Get started</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <Badge tone="brand" className="mb-5 px-3 py-1">
                <Sparkles size={13} /> AI-powered commerce platform
              </Badge>
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl">
                Run your entire business on <span className="text-brand-600 dark:text-brand-400">one intelligent platform</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600 dark:text-ink-300">
                BizPilot AI unifies inventory, orders, customers, and finance — then adds an AI assistant that forecasts, recommends, and reports, so you make decisions in minutes, not days.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="px-5 py-3 text-base" onClick={() => navigate('/signup')}>Start free trial <ArrowRight size={18} /></Button>
                <Button variant="outline" className="px-5 py-3 text-base" onClick={() => navigate('/login')}>Live demo</Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500 dark:text-ink-400">
                <span className="flex items-center gap-1.5"><Check size={15} className="text-accent-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Check size={15} className="text-accent-500" /> 14-day trial</span>
                <span className="flex items-center gap-1.5"><Check size={15} className="text-accent-500" /> Cancel anytime</span>
              </div>
            </div>

            {/* Hero visual: a mock dashboard card */}
            <div className="relative animate-fade-in lg:pl-8">
              <div className="card overflow-hidden p-0 shadow-pop">
                <div className="flex items-center gap-2 border-b border-ink-200/70 px-4 py-3 dark:border-ink-800/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-400" />
                  <span className="ml-3 text-xs font-medium text-ink-400">bizpilot.ai/app</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: 'Revenue', v: '$128.4k', d: '+12.4%' },
                      { l: 'Orders', v: '1,842', d: '+8.1%' },
                      { l: 'Customers', v: '624', d: '+5.2%' },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl bg-ink-50 p-3 dark:bg-ink-800/50">
                        <p className="text-[11px] font-medium text-ink-400">{s.l}</p>
                        <p className="mt-0.5 font-display text-base font-bold text-ink-900 dark:text-white">{s.v}</p>
                        <p className="text-[10px] font-semibold text-accent-600 dark:text-accent-400">{s.d}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-ink-200/70 p-3 dark:border-ink-800/60">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink-700 dark:text-ink-200">Revenue overview</span>
                      <Badge tone="green">+12.4%</Badge>
                    </div>
                    <AreaChart data={revenueSeries} height={150} compact />
                  </div>
                  <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-brand-50 p-3 dark:bg-brand-500/10">
                    <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-500" />
                    <p className="text-xs text-ink-700 dark:text-ink-200">Restock <b>Pulse Fitness Band</b> and <b>Nimbus Smart Bottle</b> — both below reorder level. Projected cost: $3,200.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logos */}
          <div className="mt-16 border-t border-ink-200/60 pt-8 dark:border-ink-800/60">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-400">Trusted by modern commerce teams</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-ink-400 dark:text-ink-500">
              {['Northwind', 'Lumen', 'Atlas', 'Verve', 'Bloom', 'Greenleaf'].map((n) => (
                <span key={n} className="font-display text-lg font-bold tracking-tight opacity-60">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="brand" className="mb-4">Everything in one place</Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-4xl">A complete toolkit for modern commerce</h2>
          <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">Stop juggling spreadsheets and disconnected apps. BizPilot AI brings every part of your business together.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card card-hover group p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl2 bg-brand-50 text-brand-600 transition group-hover:scale-110 dark:bg-brand-500/15 dark:text-brand-300">
                <f.icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-ink-50 py-20 dark:bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-4xl">Loved by operators worldwide</h2>
            <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">Thousands of teams trust BizPilot AI to run their day-to-day.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { quote: "We replaced four tools with BizPilot AI. The assistant alone saves me two hours a day.", name: 'Priya Sharma', role: 'Founder, Atlas Goods' },
              { quote: "The finance dashboard finally gives me a clear picture of cash flow without spreadsheets.", name: 'Marcus Lee', role: 'COO, Verve' },
              { quote: "Inventory alerts are scary accurate. We haven't had a stockout since switching.", name: 'Sofia Almeida', role: 'Ops Lead, Bloom' },
            ].map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-200">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white">{t.name.split(' ').map((n) => n[0]).join('')}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-ink-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge tone="brand" className="mb-4">Simple pricing</Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-4xl">Plans that grow with you</h2>
          <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">Start free. Upgrade when you're ready. No hidden fees.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={cx('card relative p-6', p.highlight && 'ring-2 ring-brand-500 shadow-pop')}>
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
              <p className="font-display text-lg font-semibold text-ink-900 dark:text-white">{p.name}</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{p.desc}</p>
              <p className="mt-4 font-display text-4xl font-bold text-ink-900 dark:text-white">{p.price}<span className="text-base font-medium text-ink-400">{p.period}</span></p>
              <Button variant={p.highlight ? 'primary' : 'outline'} className="mt-5 w-full" onClick={() => navigate('/signup')}>{p.cta}</Button>
              <ul className="mt-6 space-y-3">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm text-ink-600 dark:text-ink-300">
                    <Check size={16} className="text-accent-500" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-center text-white shadow-pop sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-10 right-10 h-48 w-48 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 -left-10 h-48 w-48 rounded-full bg-accent-300 blur-3xl" />
          </div>
          <div className="relative">
            <Shield className="mx-auto mb-4" size={32} />
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready to pilot your business with AI?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">Join thousands of operators using BizPilot AI to grow faster and work smarter.</p>
            <Button variant="outline" className="mt-7 border-white/30 bg-white/10 px-6 py-3 text-base text-white hover:bg-white/20" onClick={() => navigate('/signup')}>
              Get started free <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200/60 dark:border-ink-800/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white"><Zap size={16} fill="currentColor" /></span>
                <span className="font-display text-base font-bold text-ink-900 dark:text-white">BizPilot AI</span>
              </div>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">The intelligent operating system for modern commerce.</p>
            </div>
            {[
              { h: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
              { h: 'Company', links: ['About', 'Customers', 'Careers', 'Contact'] },
              { h: 'Resources', links: ['Docs', 'Blog', 'Support', 'Status'] },
            ].map((col) => (
              <div key={col.h}>
                <p className="text-sm font-semibold text-ink-900 dark:text-white">{col.h}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => <li key={l}><a href="#" className="text-sm text-ink-500 transition hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-200/60 pt-6 dark:border-ink-800/60 sm:flex-row">
            <p className="text-xs text-ink-400">© 2026 BizPilot AI, Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-ink-400">
              <Globe size={16} />
              <span className="text-xs">English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
