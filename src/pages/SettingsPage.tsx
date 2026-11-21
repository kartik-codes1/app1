import { useState } from 'react';
import {
  User, Building2, Bell, CreditCard, Shield, Moon, Sun, Check, LogOut, Zap, Globe,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useRouter } from '@/lib/router';
import { cx } from '@/lib/format';

const sections = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'company', label: 'Company', icon: Building2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'security', label: 'Security', icon: Shield },
] as const;

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { navigate } = useRouter();
  const [active, setActive] = useState<(typeof sections)[number]['key']>('profile');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Manage your account, workspace, and preferences." />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Section nav */}
        <Card className="h-fit p-3 lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition', active === s.key ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' : 'text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800')}
              >
                <s.icon size={17} /> {s.label}
              </button>
            ))}
            <div className="my-2 h-px bg-ink-100 dark:bg-ink-800" />
            <button onClick={() => { signOut(); navigate('/'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10">
              <LogOut size={17} /> Sign out
            </button>
          </nav>
        </Card>

        {/* Content */}
        <div className="space-y-6 lg:col-span-3">
          {active === 'profile' && (
            <>
              <Card>
                <CardHeader title="Profile" subtitle="Your personal information and avatar" />
                <div className="flex items-center gap-4">
                  <Avatar initials={user?.avatarInitials ?? 'U'} size="lg" />
                  <div>
                    <Button variant="outline">Change avatar</Button>
                    <p className="mt-2 text-xs text-ink-400">JPG or PNG, max 2MB</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Input label="Full name" defaultValue={user?.name} />
                  <Input label="Email" type="email" defaultValue={user?.email} />
                  <Input label="Role" defaultValue={user?.role} />
                  <Input label="Phone" defaultValue="+1 415 555 0192" />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Button onClick={save}>{saved ? <><Check size={16} /> Saved</> : 'Save changes'}</Button>
                  <Button variant="ghost">Cancel</Button>
                </div>
              </Card>

              <Card>
                <CardHeader title="Appearance" subtitle="Choose how BizPilot AI looks to you" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={() => setTheme('light')} className={cx('flex items-center gap-3 rounded-xl2 border-2 p-4 text-left transition', theme === 'light' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/5' : 'border-ink-200 dark:border-ink-700 hover:border-ink-300')}>
                    <Sun size={20} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">Light</p>
                      <p className="text-xs text-ink-400">Bright and clean</p>
                    </div>
                    {theme === 'light' && <Check size={16} className="ml-auto text-brand-600" />}
                  </button>
                  <button onClick={() => setTheme('dark')} className={cx('flex items-center gap-3 rounded-xl2 border-2 p-4 text-left transition', theme === 'dark' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/5' : 'border-ink-200 dark:border-ink-700 hover:border-ink-300')}>
                    <Moon size={20} className="text-brand-500" />
                    <div>
                      <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">Dark</p>
                      <p className="text-xs text-ink-400">Easy on the eyes</p>
                    </div>
                    {theme === 'dark' && <Check size={16} className="ml-auto text-brand-600" />}
                  </button>
                </div>
              </Card>
            </>
          )}

          {active === 'company' && (
            <Card>
              <CardHeader title="Company" subtitle="Your business details" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Company name" defaultValue={user?.company} />
                <Input label="Industry" defaultValue="Retail & E-commerce" />
                <Input label="Website" defaultValue="https://northwind.co" />
                <Input label="Currency" defaultValue="USD ($)" />
                <Input label="Time zone" defaultValue="America/Los_Angeles" />
                <Input label="Tax ID" defaultValue="XX-XXX1234" />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Button onClick={save}>{saved ? <><Check size={16} /> Saved</> : 'Save changes'}</Button>
              </div>
            </Card>
          )}

          {active === 'notifications' && (
            <Card>
              <CardHeader title="Notifications" subtitle="Choose what you want to hear about" />
              <div className="space-y-1">
                {[
                  { title: 'Low stock alerts', desc: 'Get notified when products hit reorder level', on: true },
                  { title: 'New orders', desc: 'A push for every new order received', on: true },
                  { title: 'Daily summary', desc: 'A morning digest of your key metrics', on: true },
                  { title: 'Weekly finance report', desc: 'Profit, cash flow, and expenses every Monday', on: false },
                  { title: 'Customer milestones', desc: 'When a customer becomes VIP or is at risk', on: true },
                  { title: 'Product updates', desc: 'New BizPilot AI features and improvements', on: false },
                ].map((n) => (
                  <ToggleRow key={n.title} title={n.title} desc={n.desc} defaultOn={n.on} />
                ))}
              </div>
            </Card>
          )}

          {active === 'billing' && (
            <>
              <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white/80">Current plan</p>
                    <p className="mt-1 font-display text-2xl font-bold">Growth</p>
                    <p className="mt-1 text-sm text-white/85">$49/month · renews Dec 20, 2026</p>
                  </div>
                  <Zap size={28} className="text-white/80" />
                </div>
                <div className="mt-5 flex gap-3">
                  <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Upgrade to Enterprise</Button>
                  <Button variant="ghost" className="text-white/80 hover:bg-white/10">Cancel plan</Button>
                </div>
              </Card>
              <Card>
                <CardHeader title="Payment method" subtitle="Your billing card on file" />
                <div className="flex items-center gap-4 rounded-xl border border-ink-200/70 p-4 dark:border-ink-800/60">
                  <span className="grid h-10 w-14 place-items-center rounded-lg bg-ink-900 text-white"><CreditCard size={18} /></span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-800 dark:text-ink-100">Visa ending 4242</p>
                    <p className="text-xs text-ink-400">Expires 08/28</p>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </Card>
              <Card>
                <CardHeader title="Billing history" subtitle="Recent invoices" />
                <div className="space-y-2">
                  {['Nov 2026', 'Oct 2026', 'Sep 2026'].map((m) => (
                    <div key={m} className="flex items-center justify-between rounded-xl border border-ink-200/70 p-3 text-sm dark:border-ink-800/60">
                      <span className="text-ink-700 dark:text-ink-200">{m} — Growth plan</span>
                      <div className="flex items-center gap-3">
                        <Badge tone="green">Paid</Badge>
                        <span className="text-ink-500">$49.00</span>
                        <button className="text-brand-600 hover:underline dark:text-brand-400">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {active === 'security' && (
            <>
              <Card>
                <CardHeader title="Password" subtitle="Update your password regularly to stay secure" />
                <div className="grid gap-4 sm:max-w-md">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="••••••••" />
                  <Input label="Confirm new password" type="password" placeholder="••••••••" />
                </div>
                <Button className="mt-5" onClick={save}>{saved ? <><Check size={16} /> Updated</> : 'Update password'}</Button>
              </Card>
              <Card>
                <CardHeader title="Two-factor authentication" subtitle="Add an extra layer of security" />
                <div className="flex items-center justify-between rounded-xl border border-ink-200/70 p-4 dark:border-ink-800/60">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300"><Shield size={18} /></span>
                    <div>
                      <p className="text-sm font-medium text-ink-800 dark:text-ink-100">Authenticator app</p>
                      <p className="text-xs text-ink-400">Enabled · Google Authenticator</p>
                    </div>
                  </div>
                  <Badge tone="green"><Check size={12} /> Active</Badge>
                </div>
              </Card>
              <Card>
                <CardHeader title="Active sessions" subtitle="Devices currently signed in" />
                <div className="space-y-2">
                  {[
                    { d: 'MacBook Pro · Chrome', l: 'San Francisco, US', cur: true },
                    { d: 'iPhone 15 · Safari', l: 'San Francisco, US', cur: false },
                  ].map((s) => (
                    <div key={s.d} className="flex items-center justify-between rounded-xl border border-ink-200/70 p-3 text-sm dark:border-ink-800/60">
                      <div>
                        <p className="font-medium text-ink-800 dark:text-ink-100">{s.d}</p>
                        <p className="flex items-center gap-1 text-xs text-ink-400"><Globe size={12} /> {s.l}</p>
                      </div>
                      {s.cur ? <Badge tone="brand">This device</Badge> : <button className="text-red-600 hover:underline">Revoke</button>}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ title, desc, defaultOn }: { title: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-200/70 p-4 dark:border-ink-800/60">
      <div>
        <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{title}</p>
        <p className="text-xs text-ink-400">{desc}</p>
      </div>
      <button
        onClick={() => setOn((o) => !o)}
        className={cx('relative h-6 w-11 rounded-full transition', on ? 'bg-brand-600' : 'bg-ink-200 dark:bg-ink-700')}
        aria-pressed={on}
      >
        <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}
