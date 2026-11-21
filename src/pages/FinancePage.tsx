import {
  Wallet, TrendingUp, TrendingDown, Download, ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank, Receipt,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';
import { AreaChart } from '@/components/ui/charts/AreaChart';
import { DonutChart } from '@/components/ui/charts/DonutChart';
import { BarChart } from '@/components/ui/charts/BarChart';
import { transactions, cashflowSeries, expenseBreakdown, kpis } from '@/lib/mockData';
import { formatCurrency, formatDate, cx } from '@/lib/format';

export function FinancePage() {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  return (
    <DashboardLayout>
      <PageHeader
        title="Finance"
        subtitle="Cash flow, profit, and expenses across your accounts."
        actions={
          <>
            <Button variant="outline"><Download size={16} /> Export</Button>
            <Button>Connect account</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Net Income" value={formatCurrency(net, true)} delta={kpis.margin.delta} positive series={kpis.revenue.series} icon={<DollarSign size={18} />} />
        <KpiCard label="Total Income" value={formatCurrency(income, true)} delta={12.4} positive series={kpis.revenue.series} icon={<TrendingUp size={18} />} />
        <KpiCard label="Total Expenses" value={formatCurrency(expense, true)} delta={4.8} positive={false} series={kpis.inventory.series} icon={<TrendingDown size={18} />} />
        <KpiCard label="Profit Margin" value={`${kpis.margin.current}%`} delta={kpis.margin.delta} positive series={kpis.margin.series} icon={<PiggyBank size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Cash flow" subtitle="Net cash position by month (in $k)" action={<Badge tone="green">Healthy</Badge>} />
          <BarChart data={cashflowSeries} height={280} />
        </Card>
        <Card>
          <CardHeader title="Expense breakdown" subtitle="Share of spend" />
          <DonutChart data={expenseBreakdown} height={260} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0">
          <div className="border-b border-ink-200/70 p-5 dark:border-ink-800/60">
            <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-100">Recent transactions</h3>
            <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">All accounts, last 7 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Account</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="transition hover:bg-ink-50 dark:hover:bg-ink-800/40">
                    <td className="px-5 py-3 text-ink-500">{formatDate(t.date)}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-lg', t.type === 'income' ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300' : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300')}>
                          {t.type === 'income' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                        </span>
                        <span className="font-medium text-ink-800 dark:text-ink-100">{t.description}</span>
                      </span>
                    </td>
                    <td className="hidden px-5 py-3 sm:table-cell"><Badge tone="gray">{t.category}</Badge></td>
                    <td className="hidden px-5 py-3 text-ink-500 md:table-cell">{t.account}</td>
                    <td className={cx('px-5 py-3 text-right font-semibold', t.type === 'income' ? 'text-accent-600 dark:text-accent-400' : 'text-ink-800 dark:text-ink-100')}>
                      {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-accent-500 to-accent-700 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">Available balance</p>
                <p className="mt-1 font-display text-3xl font-bold">{formatCurrency(84200)}</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Wallet size={20} /></span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/85">
              <TrendingUp size={15} /> +$24k vs last month
            </div>
          </Card>

          <Card>
            <CardHeader title="Income vs expenses" subtitle="Last 6 months" />
            <AreaChart data={cashflowSeries} height={180} />
          </Card>

          <Card className="border-brand-200 bg-brand-50/60 dark:border-brand-500/20 dark:bg-brand-500/5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300"><Receipt size={18} /></span>
              <div>
                <p className="font-semibold text-ink-800 dark:text-ink-100">Upcoming invoice</p>
                <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">Greenleaf Wholesale — $1,840 due in 5 days.</p>
                <Button variant="outline" className="mt-3 w-full">Send reminder</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
