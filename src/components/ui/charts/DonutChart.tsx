import { useId } from 'react';
import type { SeriesPoint } from '@/lib/types';

const palette = ['#3366ff', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e', '#8b5cf6'];

export function DonutChart({ data, height = 220 }: { data: SeriesPoint[]; height?: number }) {
  const id = useId();
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 70;
  const stroke = 28;
  const cx = 100;
  const cy = 100;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const len = frac * circ;
    const seg = { color: palette[i % palette.length], dash: `${len} ${circ - len}`, offset: -offset, label: d.label, value: d.value, pct: Math.round(frac * 100) };
    offset += len;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <svg viewBox="0 0 200 200" style={{ height }} className="w-auto shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-ink-100 dark:stroke-ink-800" strokeWidth={stroke} />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={s.dash}
            strokeDashoffset={s.offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-ink-800 dark:fill-ink-100 text-[18px] font-bold" fontWeight="700">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-ink-400 text-[10px]">Total</text>
      </svg>
      <div className="flex-1 space-y-2.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-600 dark:text-ink-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="font-medium text-ink-800 dark:text-ink-100">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
