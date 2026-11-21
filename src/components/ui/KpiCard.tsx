import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from './Card';
import { Sparkline } from './charts/Sparkline';
import { cx } from '@/lib/format';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  delta: number;
  positive: boolean;
  series: number[];
  icon: ReactNode;
}

export function KpiCard({ label, value, delta, positive, series, icon }: KpiCardProps) {
  return (
    <Card hover className="animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-900 dark:text-white">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className={cx('inline-flex items-center gap-1 text-xs font-semibold', positive ? 'text-accent-600 dark:text-accent-400' : 'text-red-600 dark:text-red-400')}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(delta)}%
          <span className="font-normal text-ink-400">vs last month</span>
        </span>
        <div className="w-28">
          <Sparkline data={series} positive={positive} />
        </div>
      </div>
    </Card>
  );
}
