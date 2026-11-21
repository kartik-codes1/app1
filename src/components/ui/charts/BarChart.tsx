import type { SeriesPoint } from '@/lib/types';

export function BarChart({ data, height = 220 }: { data: SeriesPoint[]; height?: number }) {
  const w = 600;
  const h = height;
  const pad = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const barW = innerW / data.length * 0.55;
  const gap = innerW / data.length * 0.45;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const gy = pad.top + innerH - t * innerH;
        return (
          <g key={i}>
            <line x1={pad.left} y1={gy} x2={w - pad.right} y2={gy} className="stroke-ink-200 dark:stroke-ink-800" strokeWidth="1" strokeDasharray="3 4" />
            <text x={pad.left - 8} y={gy + 4} textAnchor="end" className="fill-ink-400 text-[10px]">{Math.round(max * t)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bh = (d.value / max) * innerH;
        const bx = pad.left + i * (barW + gap) + gap / 2;
        const by = pad.top + innerH - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} rx="5" className="fill-brand-500/85" />
            <text x={bx + barW / 2} y={h - 8} textAnchor="middle" className="fill-ink-400 text-[10px]">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
