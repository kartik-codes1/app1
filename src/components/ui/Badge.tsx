import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

type Tone = 'brand' | 'green' | 'amber' | 'red' | 'gray' | 'blue';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  green: 'bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  gray: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};

export function Badge({ tone = 'gray', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('badge', tones[tone], className)}>{children}</span>;
}
