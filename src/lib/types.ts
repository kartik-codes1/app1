export type ThemeMode = 'light' | 'dark';

export type PageKey =
  | 'dashboard'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'finance'
  | 'assistant'
  | 'reports'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatarInitials: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  price: number;
  cost: number;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  trend: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  channel: 'web' | 'pos' | 'marketplace' | 'wholesale';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  segment: 'vip' | 'loyal' | 'new' | 'at-risk';
  lastOrder: string;
  avatarInitials: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  account: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface KpiTrend {
  current: number;
  delta: number;
  positive: boolean;
  series: number[];
}
