import type { PageKey } from '@/lib/types';
import { cx } from '@/lib/format';

export interface NavItem {
  key: PageKey;
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/app' },
  { key: 'inventory', label: 'Inventory', href: '/app/inventory' },
  { key: 'orders', label: 'Orders', href: '/app/orders' },
  { key: 'customers', label: 'Customers', href: '/app/customers' },
  { key: 'finance', label: 'Finance', href: '/app/finance' },
  { key: 'assistant', label: 'AI Assistant', href: '/app/assistant' },
  { key: 'reports', label: 'Reports', href: '/app/reports' },
  { key: 'settings', label: 'Settings', href: '/app/settings' },
];

export function isActive(path: string, href: string): boolean {
  if (href === '/app') return path === '/app' || path === '/app/';
  return path === href || path.startsWith(href + '/');
}

export function cxNav(active: boolean): string {
  return cx('nav-link', active && 'nav-link-active');
}
