import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/format';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  hint?: string;
}

export function Input({ label, icon, hint, className, id, ...props }: InputProps) {
  return (
    <label className="block" htmlFor={id}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</span>}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input id={id} className={cx('input-base', icon ? 'pl-10' : '', className)} {...props} />
      </div>
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  );
}
