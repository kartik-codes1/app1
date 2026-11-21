import { useId } from 'react';
import type { SeriesPoint } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

export function AreaChart({ data, height = 220, compact = false }: { data: SeriesPoint[]; height?: number; compact?: boolean }) {
  const id = useId();
  const w = 600;
  const h = height;
  const pad = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const min = 0;
  const x = (i: number) => pad.left + (i / (data.length - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1)} ${pad.top + innerH} L ${x(0)} ${pad.top + innerH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => pad.top + innerH - t * innerH);
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(51 102 255)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="rgb(51 102 255)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridLines.map((gy, i) => (
        <line key={i} x1={pad.left} y1={gy} x2={w - pad.right} y2={gy} className="stroke-ink-200 dark:stroke-ink-800" strokeWidth="1" strokeDasharray="3 4" />
      ))}
      {!compact && yLabels.map((v, i) => (
        <text key={i} x={pad.left - 8} y={gridLines[i] + 4} textAnchor="end" className="fill-ink-400 text-[10px]">
          {formatCurrency(v * 1000, true)}
        </text>
      ))}
      <path d={areaPath} fill={`url(#area-${id})`} />
      <path d={linePath} fill="none" className="stroke-brand-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r="3" className="fill-white stroke-brand-500" strokeWidth="2" />
          {!compact && <text x={x(i)} y={h - 8} textAnchor="middle" className="fill-ink-400 text-[10px]">{d.label}</text>}
        </g>
      ))}
    </svg>
  );
}
