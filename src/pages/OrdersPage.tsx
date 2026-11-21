import { useState } from 'react';
import { Plus, Search, Download, ShoppingCart, Filter, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';
import { BarChart } from '@/components/ui/charts/BarChart';
import { orders, kpis, categorySales } from '@/lib/mockData';
import { formatCurrency, formatDate, cx } from '@/lib/format';
import type { Order } from '@/lib/types';
import { DollarSign, Package, Truck, XCircle } from 'lucide-react';

const statusTone: Record<string, 'amber' | 'blue' | 'green' | 'red'> = {
  pending: 'amber', processing: 'blue', shipped: 'blue', delivered: 'green', cancelled: 'red',
};
const payTone: Record<string, 'green' | 'amber' | 'red'> = { paid: 'green', unpaid: 'amber', refunded: 'red' };
const channelTone: Record<string, 'brand' | 'green' | 'amber' | 'blue'> = {
  web: 'brand', pos: 'green', marketplace: 'amber', wholesale: 'blue',
};
const tabs = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export function OrdersPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchesTab = tab === 'All' || o.status === tab;
    const matchesQuery = o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Orders"
        subtitle="Manage and fulfill orders across every sales channel."
        actions={
          <>
            <Button variant="outline"><Download size={16} /> Export</Button>
            <Button><Plus size={16} /> New order</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Orders" value={orders.length.toLocaleString()} delta={kpis.orders.delta} positive series={kpis.orders.series} icon={<ShoppingCart size={18} />} />
        <KpiCard label="Revenue" value={formatCurrency(totalRevenue, true)} delta={kpis.revenue.delta} positive series={kpis.revenue.series} icon={<DollarSign size={18} />} />
        <KpiCard label="Pending Fulfillment" value={String(pending)} delta={3.2} positive series={kpis.orders.series} icon={<Package size={18} />} />
        <KpiCard label="Delivered" value={String(delivered)} delta={6.4} positive series={kpis.orders.series} icon={<Truck size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0">
          <div className="flex flex-col gap-3 border-b border-ink-200/70 p-4 dark:border-ink-800/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders or customers…" className="input-base pl-9" />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cx('rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition', tab === t ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Channel</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {filtered.map((o) => (
                  <tr key={o.id} onClick={() => setSelected(o)} className="cursor-pointer transition hover:bg-ink-50 dark:hover:bg-ink-800/40">
                    <td className="px-4 py-3 font-medium text-brand-600 dark:text-brand-400">{o.id}</td>
                    <td className="px-4 py-3 text-ink-700 dark:text-ink-200">{o.customer}</td>
                    <td className="hidden px-4 py-3 sm:table-cell"><Badge tone={channelTone[o.channel]} className="capitalize">{o.channel}</Badge></td>
                    <td className="hidden px-4 py-3 text-ink-500 md:table-cell">{formatDate(o.date)}</td>
                    <td className="px-4 py-3"><Badge tone={statusTone[o.status]} className="capitalize">{o.status}</Badge></td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="py-16 text-center text-ink-400">No orders found.</div>}
        </Card>

        <Card>
          <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-100">Orders by category</h3>
          <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">Distribution this month</p>
          <div className="mt-4">
            <BarChart data={categorySales} height={220} />
          </div>
        </Card>
      </div>

      {/* Order detail drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-pop animate-slide-in dark:bg-ink-900">
            <div className="flex items-center justify-between border-b border-ink-200/70 px-5 py-4 dark:border-ink-800/60">
              <div>
                <p className="font-display text-lg font-bold text-ink-900 dark:text-white">{selected.id}</p>
                <p className="text-sm text-ink-400">{formatDate(selected.date)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-2"><X size={18} /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone={statusTone[selected.status]} className="capitalize">{selected.status}</Badge>
                <Badge tone={payTone[selected.paymentStatus]} className="capitalize">{selected.paymentStatus}</Badge>
                <Badge tone={channelTone[selected.channel]} className="capitalize">{selected.channel}</Badge>
              </div>
              <div className="card p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Customer</p>
                <p className="mt-1 font-semibold text-ink-800 dark:text-ink-100">{selected.customer}</p>
                <p className="text-sm text-ink-500">{selected.customerEmail}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Items</p>
                <div className="space-y-2">
                  {selected.items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between rounded-xl border border-ink-200/70 p-3 dark:border-ink-800/60">
                      <div>
                        <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{it.name}</p>
                        <p className="text-xs text-ink-400">Qty {it.qty} × {formatCurrency(it.price)}</p>
                      </div>
                      <span className="font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(it.qty * it.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-ink-200/70 p-5 dark:border-ink-800/60">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Subtotal</span>
                <span className="text-ink-800 dark:text-ink-100">{formatCurrency(selected.total)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-ink-500">Shipping</span>
                <span className="text-ink-800 dark:text-ink-100">{formatCurrency(0)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
                <span className="font-semibold text-ink-900 dark:text-white">Total</span>
                <span className="font-display text-xl font-bold text-ink-900 dark:text-white">{formatCurrency(selected.total)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1">Mark shipped</Button>
                <Button variant="outline" className="flex-1"><XCircle size={15} /> Cancel</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
