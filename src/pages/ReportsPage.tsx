import {
  Download, Calendar, FileText, TrendingUp, ShoppingCart, Users, Package, DollarSign, Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';
import { AreaChart } from '@/components/ui/charts/AreaChart';
import { BarChart } from '@/components/ui/charts/BarChart';
import { DonutChart } from '@/components/ui/charts/DonutChart';
import { revenueSeries, categorySales, salesByChannel, expenseBreakdown, kpis, cashflowSeries } from '@/lib/mockData';
import { cx } from '@/lib/format';

const reports = [
  { icon: TrendingUp, title: 'Sales Performance', desc: 'Revenue, orders, and conversion trends', date: 'Nov 20, 2026', tone: 'brand' as const },
  { icon: Package, title: 'Inventory Health', desc: 'Stock levels, turnover, and reorder needs', date: 'Nov 19, 2026', tone: 'amber' as const },
  { icon: Users, title: 'Customer Insights', desc: 'Segmentation, LTV, and retention', date: 'Nov 18, 2026', tone: 'green' as const },
  { icon: DollarSign, title: 'Financial Summary', desc: 'P&L, cash flow, and margins', date: 'Nov 17, 2026', tone: 'blue' as const },
];

const toneClasses = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  green: 'bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300',
  blue: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
};

export function ReportsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate, view, and export reports across your business."
        actions={
          <>
            <Button variant="outline"><Calendar size={16} /> Last 12 months</Button>
            <Button><Download size={16} /> Export all</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue" value="$128.4k" delta={kpis.revenue.delta} positive series={kpis.revenue.series} icon={<TrendingUp size={18} />} />
        <KpiCard label="Orders" value="1,842" delta={kpis.orders.delta} positive series={kpis.orders.series} icon={<ShoppingCart size={18} />} />
        <KpiCard label="New Customers" value="624" delta={kpis.customers.delta} positive series={kpis.customers.series} icon={<Users size={18} />} />
        <KpiCard label="Avg. Margin" value="38.4%" delta={kpis.margin.delta} positive series={kpis.margin.series} icon={<DollarSign size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue trend" subtitle="Monthly revenue, 12-month view" action={<Badge tone="green">+12.4% YoY</Badge>} />
          <AreaChart data={revenueSeries} height={280} />
        </Card>
        <Card>
          <CardHeader title="Sales by channel" subtitle="Revenue distribution" />
          <DonutChart data={salesByChannel} height={260} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Category performance" subtitle="Share of total sales" />
          <BarChart data={categorySales} height={240} />
        </Card>
        <Card>
          <CardHeader title="Cash flow trend" subtitle="Net cash by month ($k)" />
          <AreaChart data={cashflowSeries} height={240} />
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Saved reports</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">Pre-built reports, ready to export</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reports.map((r) => (
            <Card key={r.title} hover className="group">
              <div className="flex items-start justify-between">
                <span className={cx('grid h-11 w-11 place-items-center rounded-xl2 transition group-hover:scale-110', toneClasses[r.tone])}>
                  <r.icon size={20} />
                </span>
                <FileText size={16} className="text-ink-300 dark:text-ink-600" />
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-ink-900 dark:text-white">{r.title}</h3>
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{r.desc}</p>
              <p className="mt-3 text-[11px] text-ink-400">Updated {r.date}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" className="flex-1 px-2 py-1.5 text-xs">View</Button>
                <Button variant="ghost" className="px-2 py-1.5 text-xs"><Download size={13} /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Sparkles size={22} /></span>
            <div>
              <p className="font-display text-lg font-semibold">Need a custom report?</p>
              <p className="mt-1 text-sm text-white/85">Ask Pilot AI to build a report tailored to any question.</p>
            </div>
          </div>
          <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Generate with AI</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
