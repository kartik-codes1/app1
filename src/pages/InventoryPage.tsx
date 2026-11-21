import { useState } from 'react';
import { Plus, Search, Download, Package, Filter, ArrowUpDown } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';
import { products, kpis } from '@/lib/mockData';
import { formatCurrency, formatNumber, cx } from '@/lib/format';
import { Package as PackageIcon, AlertTriangle, Boxes, DollarSign } from 'lucide-react';

const statusTone: Record<string, 'green' | 'amber' | 'red'> = {
  'in-stock': 'green', 'low-stock': 'amber', 'out-of-stock': 'red',
};

const categories = ['All', 'Electronics', 'Apparel', 'Home', 'Beauty'];

export function InventoryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = products.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === 'All' || p.category === category;
    return matchesQuery && matchesCat;
  });

  const stockValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowCount = products.filter((p) => p.status !== 'in-stock').length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels, reorder points, and product performance."
        actions={
          <>
            <Button variant="outline"><Download size={16} /> Export</Button>
            <Button><Plus size={16} /> Add product</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Products" value={formatNumber(products.length)} delta={8.2} positive series={kpis.inventory.series} icon={<Boxes size={18} />} />
        <KpiCard label="Stock Value" value={formatCurrency(stockValue, true)} delta={4.1} positive series={kpis.revenue.series} icon={<DollarSign size={18} />} />
        <KpiCard label="Low / Out of Stock" value={String(lowCount)} delta={-2.1} positive={false} series={kpis.inventory.series} icon={<AlertTriangle size={18} />} />
        <KpiCard label="Avg. Margin" value={`${kpis.margin.current}%`} delta={kpis.margin.delta} positive series={kpis.margin.series} icon={<PackageIcon size={18} />} />
      </div>

      <Card className="mt-6 p-0">
        <div className="flex flex-col gap-3 border-b border-ink-200/70 p-4 dark:border-ink-800/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products or SKU…" className="input-base pl-9" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter size={15} className="shrink-0 text-ink-400" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cx('rounded-lg px-3 py-1.5 text-xs font-medium transition', category === c ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700')}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                <th className="px-4 py-3 font-medium"><span className="flex items-center gap-1">Product <ArrowUpDown size={12} /></span></th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Price</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Supplier</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {filtered.map((p) => (
                <tr key={p.id} className="transition hover:bg-ink-50 dark:hover:bg-ink-800/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><Package size={16} /></span>
                      <div>
                        <p className="font-medium text-ink-800 dark:text-ink-100">{p.name}</p>
                        <p className="text-xs text-ink-400">{formatCurrency(p.cost)} cost</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-500">{p.sku}</td>
                  <td className="hidden px-4 py-3 text-ink-600 dark:text-ink-300 md:table-cell">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-800 dark:text-ink-100">{p.stock}</span>
                      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800 sm:block">
                        <div className={cx('h-full rounded-full', p.status === 'out-of-stock' ? 'bg-red-500' : p.status === 'low-stock' ? 'bg-amber-500' : 'bg-accent-500')} style={{ width: `${Math.min(100, (p.stock / (p.reorderLevel * 3)) * 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 font-medium text-ink-800 dark:text-ink-100 sm:table-cell">{formatCurrency(p.price)}</td>
                  <td className="hidden px-4 py-3 text-ink-600 dark:text-ink-300 lg:table-cell">{p.supplier}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[p.status]} className="capitalize">{p.status.replace('-', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-ink-400">No products match your filters.</div>
        )}
      </Card>
    </DashboardLayout>
  );
}
