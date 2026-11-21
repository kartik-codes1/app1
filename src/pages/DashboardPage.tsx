import {
  DollarSign, ShoppingCart, Users, TrendingUp, Package, Sparkles, ArrowRight, AlertTriangle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { AreaChart } from '@/components/ui/charts/AreaChart';
import { DonutChart } from '@/components/ui/charts/DonutChart';
import { BarChart } from '@/components/ui/charts/BarChart';
import { kpis, revenueSeries, salesByChannel, categorySales, orders, products } from '@/lib/mockData';
import { formatCurrency, formatDate } from '@/lib/format';
import { useRouter } from '@/lib/router';

const statusTone: Record<string, 'amber' | 'blue' | 'green' | 'red' | 'gray'> = {
  pending: 'amber', processing: 'blue', shipped: 'blue', delivered: 'green', cancelled: 'red',
};

export function DashboardPage() {
  const { navigate } = useRouter();
  const lowStock = products.filter((p) => p.status !== 'in-stock');
  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Alex. Here's what's happening with your business today."
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/app/reports')}>View reports</Button>
            <Button onClick={() => navigate('/app/assistant')}><Sparkles size={16} /> Ask AI</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={formatCurrency(kpis.revenue.current, true)} delta={kpis.revenue.delta} positive={kpis.revenue.positive} series={kpis.revenue.series} icon={<DollarSign size={18} />} />
        <KpiCard label="Orders" value={kpis.orders.current.toLocaleString()} delta={kpis.orders.delta} positive={kpis.orders.positive} series={kpis.orders.series} icon={<ShoppingCart size={18} />} />
        <KpiCard label="Customers" value={kpis.customers.current.toLocaleString()} delta={kpis.customers.delta} positive={kpis.customers.positive} series={kpis.customers.series} icon={<Users size={18} />} />
        <KpiCard label="Avg. Order Value" value={formatCurrency(kpis.aov.current)} delta={kpis.aov.delta} positive={kpis.aov.positive} series={kpis.aov.series} icon={<TrendingUp size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue overview"
            subtitle="Monthly revenue for the past 12 months"
            action={<Badge tone="green">+12.4%</Badge>}
          />
          <AreaChart data={revenueSeries} height={280} />
        </Card>

        <Card>
          <CardHeader title="Sales by channel" subtitle="This year to date" />
          <DonutChart data={salesByChannel} height={240} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent orders"
            subtitle="Latest activity across all channels"
            action={<Button variant="ghost" onClick={() => navigate('/app/orders')}>View all <ArrowRight size={15} /></Button>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="hidden pb-2 font-medium sm:table-cell">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="transition hover:bg-ink-50 dark:hover:bg-ink-800/40">
                    <td className="py-3 font-medium text-brand-600 dark:text-brand-400">{o.id}</td>
                    <td className="py-3 text-ink-700 dark:text-ink-200">{o.customer}</td>
                    <td className="hidden py-3 text-ink-500 sm:table-cell">{formatDate(o.date)}</td>
                    <td className="py-3"><Badge tone={statusTone[o.status]}>{o.status}</Badge></td>
                    <td className="py-3 text-right font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Category mix" subtitle="Share of sales" />
            <BarChart data={categorySales} height={200} />
          </Card>

          <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-500/20 dark:bg-amber-500/5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300"><AlertTriangle size={18} /></span>
              <div className="flex-1">
                <p className="font-semibold text-ink-800 dark:text-ink-100">Restock alerts</p>
                <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{lowStock.length} products need attention.</p>
                <div className="mt-3 space-y-2">
                  {lowStock.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-ink-700 dark:text-ink-200"><Package size={14} className="text-ink-400" /> {p.name}</span>
                      <Badge tone={p.status === 'out-of-stock' ? 'red' : 'amber'}>{p.stock} left</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-3 w-full" onClick={() => navigate('/app/inventory')}>Manage inventory</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Sparkles size={20} /></span>
            <div className="flex-1">
              <p className="font-display text-lg font-semibold">AI Insight of the day</p>
              <p className="mt-2 text-sm text-white/85">Revenue is trending 12.4% above last month, led by Electronics. I'd recommend restocking Pulse Fitness Band and Nimbus Smart Bottle to avoid losing momentum. Want me to draft a purchase order?</p>
              <Button variant="outline" className="mt-4 border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={() => navigate('/app/assistant')}>Open assistant <ArrowRight size={15} /></Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top customers" subtitle="By lifetime value" action={<Button variant="ghost" onClick={() => navigate('/app/customers')}>View all <ArrowRight size={15} /></Button>} />
          <div className="space-y-3">
            {[
              { n: 'Greenleaf Wholesale', v: 12450, i: 'GW', seg: 'vip' as const },
              { n: 'Priya Sharma', v: 3480, i: 'PS', seg: 'vip' as const },
              { n: 'Sofia Almeida', v: 2110, i: 'SA', seg: 'loyal' as const },
            ].map((c) => (
              <div key={c.n} className="flex items-center gap-3">
                <Avatar initials={c.i} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{c.n}</p>
                  <Badge tone={c.seg === 'vip' ? 'brand' : 'green'} className="mt-0.5 capitalize">{c.seg}</Badge>
                </div>
                <span className="font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(c.v)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
