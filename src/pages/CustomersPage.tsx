import { useState } from 'react';
import { Plus, Search, Download, Users, Mail, Phone, MapPin, Filter, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';
import { Avatar } from '@/components/ui/Avatar';
import { customers, kpis } from '@/lib/mockData';
import { formatCurrency, relativeDays, cx } from '@/lib/format';
import type { Customer } from '@/lib/types';
import { UserPlus, Crown, Star, TrendingUp } from 'lucide-react';

const segmentTone: Record<string, 'brand' | 'green' | 'blue' | 'red'> = {
  vip: 'brand', loyal: 'green', new: 'blue', 'at-risk': 'red',
};
const segments = ['All', 'vip', 'loyal', 'new', 'at-risk'] as const;

export function CustomersPage() {
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<(typeof segments)[number]>('All');
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase());
    const matchesSeg = segment === 'All' || c.segment === segment;
    return matchesQuery && matchesSeg;
  });

  const totalLtv = customers.reduce((s, c) => s + c.totalSpent, 0);
  const vipCount = customers.filter((c) => c.segment === 'vip').length;
  const newCount = customers.filter((c) => c.segment === 'new').length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Customers"
        subtitle="Understand and grow your customer relationships."
        actions={
          <>
            <Button variant="outline"><Download size={16} /> Export</Button>
            <Button><Plus size={16} /> Add customer</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Customers" value={customers.length.toLocaleString()} delta={kpis.customers.delta} positive series={kpis.customers.series} icon={<Users size={18} />} />
        <KpiCard label="Lifetime Value" value={formatCurrency(totalLtv, true)} delta={9.6} positive series={kpis.revenue.series} icon={<TrendingUp size={18} />} />
        <KpiCard label="VIP Customers" value={String(vipCount)} delta={2.1} positive series={kpis.customers.series} icon={<Crown size={18} />} />
        <KpiCard label="New This Month" value={String(newCount)} delta={14.2} positive series={kpis.customers.series} icon={<UserPlus size={18} />} />
      </div>

      <Card className="mt-6 p-0">
        <div className="flex flex-col gap-3 border-b border-ink-200/70 p-4 dark:border-ink-800/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email…" className="input-base pl-9" />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            <Filter size={15} className="shrink-0 text-ink-400" />
            {segments.map((s) => (
              <button key={s} onClick={() => setSegment(s)} className={cx('rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition', segment === s ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800')}>
                {s === 'at-risk' ? 'At risk' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Location</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Total spent</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Last order</th>
                <th className="px-4 py-3 font-medium">Segment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer transition hover:bg-ink-50 dark:hover:bg-ink-800/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.avatarInitials} size="sm" />
                      <div>
                        <p className="font-medium text-ink-800 dark:text-ink-100">{c.name}</p>
                        <p className="text-xs text-ink-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-600 dark:text-ink-300 sm:table-cell">{c.location}</td>
                  <td className="px-4 py-3 text-ink-700 dark:text-ink-200">{c.orders}</td>
                  <td className="px-4 py-3 font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(c.totalSpent)}</td>
                  <td className="hidden px-4 py-3 text-ink-500 md:table-cell">{relativeDays(c.lastOrder)}</td>
                  <td className="px-4 py-3"><Badge tone={segmentTone[c.segment]} className="capitalize">{c.segment === 'at-risk' ? 'At risk' : c.segment}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-16 text-center text-ink-400">No customers found.</div>}
      </Card>

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-pop animate-slide-in dark:bg-ink-900">
            <div className="flex items-center justify-between border-b border-ink-200/70 px-5 py-4 dark:border-ink-800/60">
              <p className="font-display text-lg font-bold text-ink-900 dark:text-white">Customer profile</p>
              <button onClick={() => setSelected(null)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="flex items-center gap-4">
                <Avatar initials={selected.avatarInitials} size="lg" />
                <div>
                  <p className="font-display text-lg font-bold text-ink-900 dark:text-white">{selected.name}</p>
                  <Badge tone={segmentTone[selected.segment]} className="mt-1 capitalize">{selected.segment === 'at-risk' ? 'At risk' : selected.segment}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-3">
                  <p className="text-xs text-ink-400">Total orders</p>
                  <p className="font-display text-xl font-bold text-ink-900 dark:text-white">{selected.orders}</p>
                </div>
                <div className="card p-3">
                  <p className="text-xs text-ink-400">Total spent</p>
                  <p className="font-display text-xl font-bold text-ink-900 dark:text-white">{formatCurrency(selected.totalSpent)}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm text-ink-600 dark:text-ink-300"><Mail size={16} className="text-ink-400" /> {selected.email}</div>
                <div className="flex items-center gap-3 text-sm text-ink-600 dark:text-ink-300"><Phone size={16} className="text-ink-400" /> {selected.phone}</div>
                <div className="flex items-center gap-3 text-sm text-ink-600 dark:text-ink-300"><MapPin size={16} className="text-ink-400" /> {selected.location}</div>
              </div>
              <div className="card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Last order</p>
                <p className="mt-1 text-sm text-ink-700 dark:text-ink-200">{relativeDays(selected.lastOrder)}</p>
              </div>
              {selected.segment === 'at-risk' && (
                <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
                  <p className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300"><Star size={15} /> Win-back opportunity</p>
                  <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">This customer hasn't ordered in a while. A targeted 15% offer could recover the relationship.</p>
                </div>
              )}
            </div>
            <div className="border-t border-ink-200/70 p-5 dark:border-ink-800/60">
              <Button className="w-full">Send message</Button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
