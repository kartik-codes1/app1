import type {
  Product, Order, Customer, Transaction, ChatMessage, SeriesPoint, KpiTrend, User,
} from './types';

export const demoUser: User = {
  id: 'u_001',
  name: 'Alex Morgan',
  email: 'alex@northwind.co',
  role: 'Owner',
  company: 'Northwind Trading Co.',
  avatarInitials: 'AM',
};

export const kpis: Record<string, KpiTrend> = {
  revenue: { current: 128450, delta: 12.4, positive: true, series: [78, 92, 85, 110, 124, 118, 142, 156, 148, 172, 188, 196] },
  orders: { current: 1842, delta: 8.1, positive: true, series: [120, 132, 128, 141, 150, 162, 158, 171, 180, 175, 188, 196] },
  customers: { current: 624, delta: 5.2, positive: true, series: [400, 420, 445, 470, 490, 510, 530, 555, 575, 590, 608, 624] },
  aov: { current: 69.8, delta: 3.6, positive: true, series: [58, 60, 61, 63, 62, 65, 66, 67, 68, 69, 69, 70] },
  inventory: { current: 12480, delta: -2.1, positive: false, series: [14, 13.8, 13.5, 13.2, 13, 12.9, 12.8, 12.6, 12.5, 12.5, 12.4, 12.4] },
  margin: { current: 38.4, delta: 1.8, positive: true, series: [34, 35, 34.5, 36, 36.5, 37, 37.2, 37.8, 38, 38.1, 38.3, 38.4] },
};

export const revenueSeries: SeriesPoint[] = [
  { label: 'Jan', value: 78 }, { label: 'Feb', value: 92 }, { label: 'Mar', value: 85 },
  { label: 'Apr', value: 110 }, { label: 'May', value: 124 }, { label: 'Jun', value: 118 },
  { label: 'Jul', value: 142 }, { label: 'Aug', value: 156 }, { label: 'Sep', value: 148 },
  { label: 'Oct', value: 172 }, { label: 'Nov', value: 188 }, { label: 'Dec', value: 196 },
];

export const salesByChannel: SeriesPoint[] = [
  { label: 'Web Store', value: 64200 },
  { label: 'Marketplace', value: 31800 },
  { label: 'Wholesale', value: 21400 },
  { label: 'POS', value: 11050 },
];

export const categorySales: SeriesPoint[] = [
  { label: 'Electronics', value: 42 },
  { label: 'Apparel', value: 28 },
  { label: 'Home', value: 18 },
  { label: 'Beauty', value: 12 },
];

export const products: Product[] = [
  { id: 'p1', name: 'Aurora Wireless Earbuds', sku: 'AUR-EB-01', category: 'Electronics', stock: 240, reorderLevel: 80, price: 129.0, cost: 64.0, supplier: 'Lumen Tech', status: 'in-stock', trend: 14 },
  { id: 'p2', name: 'Nimbus Smart Bottle', sku: 'NIM-SB-02', category: 'Home', stock: 52, reorderLevel: 60, price: 39.0, cost: 17.0, supplier: 'Verve Goods', status: 'low-stock', trend: -6 },
  { id: 'p3', name: 'Pulse Fitness Band', sku: 'PLS-FB-03', category: 'Electronics', stock: 0, reorderLevel: 40, price: 89.0, cost: 41.0, supplier: 'Lumen Tech', status: 'out-of-stock', trend: -22 },
  { id: 'p4', name: 'Hearth Ceramic Mug Set', sku: 'HRT-CM-04', category: 'Home', stock: 318, reorderLevel: 100, price: 48.0, cost: 19.0, supplier: 'Verve Goods', status: 'in-stock', trend: 8 },
  { id: 'p5', name: 'Drift Linen Tee', sku: 'DRF-LT-05', category: 'Apparel', stock: 96, reorderLevel: 50, price: 34.0, cost: 11.0, supplier: 'Atlas Apparel', status: 'in-stock', trend: 21 },
  { id: 'p6', name: 'Glow Serum 30ml', sku: 'GLW-SR-06', category: 'Beauty', stock: 41, reorderLevel: 45, price: 58.0, cost: 22.0, supplier: 'Bloom Labs', status: 'low-stock', trend: 5 },
  { id: 'p7', name: 'Stride Running Shoes', sku: 'STR-RS-07', category: 'Apparel', stock: 0, reorderLevel: 30, price: 119.0, cost: 52.0, supplier: 'Atlas Apparel', status: 'out-of-stock', trend: -12 },
  { id: 'p8', name: 'Lumen Desk Lamp', sku: 'LMN-DL-08', category: 'Home', stock: 134, reorderLevel: 50, price: 75.0, cost: 33.0, supplier: 'Lumen Tech', status: 'in-stock', trend: 11 },
  { id: 'p9', name: 'Bloom Matte Lipstick', sku: 'BLM-ML-09', category: 'Beauty', stock: 220, reorderLevel: 70, price: 24.0, cost: 7.5, supplier: 'Bloom Labs', status: 'in-stock', trend: 17 },
  { id: 'p10', name: 'Atlas Canvas Backpack', sku: 'ATL-CB-10', category: 'Apparel', stock: 63, reorderLevel: 40, price: 98.0, cost: 39.0, supplier: 'Atlas Apparel', status: 'in-stock', trend: 4 },
];

export const orders: Order[] = [
  { id: '#ORD-10241', customer: 'Priya Sharma', customerEmail: 'priya@gmail.com', date: '2026-11-20', status: 'processing', total: 247.0, channel: 'web', paymentStatus: 'paid', items: [{ productId: 'p1', name: 'Aurora Wireless Earbuds', qty: 1, price: 129 }, { productId: 'p9', name: 'Bloom Matte Lipstick', qty: 2, price: 24 }] },
  { id: '#ORD-10240', customer: 'Marcus Lee', customerEmail: 'marcus@outlook.com', date: '2026-11-20', status: 'shipped', total: 89.0, channel: 'marketplace', paymentStatus: 'paid', items: [{ productId: 'p3', name: 'Pulse Fitness Band', qty: 1, price: 89 }] },
  { id: '#ORD-10239', customer: 'Sofia Almeida', customerEmail: 'sofia@gmail.com', date: '2026-11-19', status: 'delivered', total: 156.0, channel: 'web', paymentStatus: 'paid', items: [{ productId: 'p8', name: 'Lumen Desk Lamp', qty: 1, price: 75 }, { productId: 'p4', name: 'Hearth Ceramic Mug Set', qty: 1, price: 48 }, { productId: 'p5', name: 'Drift Linen Tee', qty: 1, price: 34 }] },
  { id: '#ORD-10238', customer: 'Greenleaf Wholesale', customerEmail: 'orders@greenleaf.co', date: '2026-11-19', status: 'pending', total: 1840.0, channel: 'wholesale', paymentStatus: 'unpaid', items: [{ productId: 'p4', name: 'Hearth Ceramic Mug Set', qty: 20, price: 48 }, { productId: 'p9', name: 'Bloom Matte Lipstick', qty: 10, price: 24 }] },
  { id: '#ORD-10237', customer: 'Daniel Okoro', customerEmail: 'daniel@gmail.com', date: '2026-11-18', status: 'delivered', total: 119.0, channel: 'pos', paymentStatus: 'paid', items: [{ productId: 'p7', name: 'Stride Running Shoes', qty: 1, price: 119 }] },
  { id: '#ORD-10236', customer: 'Emma Wright', customerEmail: 'emma@gmail.com', date: '2026-11-18', status: 'cancelled', total: 58.0, channel: 'web', paymentStatus: 'refunded', items: [{ productId: 'p6', name: 'Glow Serum 30ml', qty: 1, price: 58 }] },
  { id: '#ORD-10235', customer: 'Liam Chen', customerEmail: 'liam@gmail.com', date: '2026-11-17', status: 'delivered', total: 98.0, channel: 'marketplace', paymentStatus: 'paid', items: [{ productId: 'p10', name: 'Atlas Canvas Backpack', qty: 1, price: 98 }] },
  { id: '#ORD-10234', customer: 'Noor Hassan', customerEmail: 'noor@gmail.com', date: '2026-11-17', status: 'processing', total: 168.0, channel: 'web', paymentStatus: 'paid', items: [{ productId: 'p1', name: 'Aurora Wireless Earbuds', qty: 1, price: 129 }, { productId: 'p6', name: 'Glow Serum 30ml', qty: 1, price: 58 }] },
  { id: '#ORD-10233', customer: 'Olivia Brown', customerEmail: 'olivia@gmail.com', date: '2026-11-16', status: 'shipped', total: 272.0, channel: 'web', paymentStatus: 'paid', items: [{ productId: 'p8', name: 'Lumen Desk Lamp', qty: 1, price: 75 }, { productId: 'p10', name: 'Atlas Canvas Backpack', qty: 1, price: 98 }, { productId: 'p5', name: 'Drift Linen Tee', qty: 2, price: 34 }, { productId: 'p9', name: 'Bloom Matte Lipstick', qty: 1, price: 24 }] },
  { id: '#ORD-10232', customer: 'Yuki Tanaka', customerEmail: 'yuki@gmail.com', date: '2026-11-16', status: 'delivered', total: 39.0, channel: 'marketplace', paymentStatus: 'paid', items: [{ productId: 'p2', name: 'Nimbus Smart Bottle', qty: 1, price: 39 }] },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+1 415 552 0192', location: 'San Francisco, US', orders: 24, totalSpent: 3480, segment: 'vip', lastOrder: '2026-11-20', avatarInitials: 'PS' },
  { id: 'c2', name: 'Marcus Lee', email: 'marcus@outlook.com', phone: '+44 20 7946 8821', location: 'London, UK', orders: 11, totalSpent: 980, segment: 'loyal', lastOrder: '2026-11-20', avatarInitials: 'ML' },
  { id: 'c3', name: 'Sofia Almeida', email: 'sofia@gmail.com', phone: '+351 21 882 4410', location: 'Lisbon, PT', orders: 18, totalSpent: 2110, segment: 'loyal', lastOrder: '2026-11-19', avatarInitials: 'SA' },
  { id: 'c4', name: 'Greenleaf Wholesale', email: 'orders@greenleaf.co', phone: '+1 312 555 0140', location: 'Chicago, US', orders: 6, totalSpent: 12450, segment: 'vip', lastOrder: '2026-11-19', avatarInitials: 'GW' },
  { id: 'c5', name: 'Daniel Okoro', email: 'daniel@gmail.com', phone: '+234 1 280 1190', location: 'Lagos, NG', orders: 2, totalSpent: 240, segment: 'new', lastOrder: '2026-11-18', avatarInitials: 'DO' },
  { id: 'c6', name: 'Emma Wright', email: 'emma@gmail.com', phone: '+1 646 552 8841', location: 'New York, US', orders: 9, totalSpent: 760, segment: 'at-risk', lastOrder: '2026-10-02', avatarInitials: 'EW' },
  { id: 'c7', name: 'Liam Chen', email: 'liam@gmail.com', phone: '+86 21 6888 4410', location: 'Shanghai, CN', orders: 14, totalSpent: 1620, segment: 'loyal', lastOrder: '2026-11-17', avatarInitials: 'LC' },
  { id: 'c8', name: 'Noor Hassan', email: 'noor@gmail.com', phone: '+971 4 225 8810', location: 'Dubai, AE', orders: 3, totalSpent: 410, segment: 'new', lastOrder: '2026-11-17', avatarInitials: 'NH' },
];

export const transactions: Transaction[] = [
  { id: 't1', date: '2026-11-20', description: 'Web store payouts', category: 'Sales', type: 'income', amount: 18420.0, account: 'Operating' },
  { id: 't2', date: '2026-11-19', description: 'Inventory restock — Lumen Tech', category: 'Inventory', type: 'expense', amount: 6240.0, account: 'Operating' },
  { id: 't3', date: '2026-11-19', description: 'Marketplace settlement', category: 'Sales', type: 'income', amount: 9180.0, account: 'Operating' },
  { id: 't4', date: '2026-11-18', description: 'Warehouse rent', category: 'Operations', type: 'expense', amount: 3200.0, account: 'Operating' },
  { id: 't5', date: '2026-11-18', description: 'Stripe processing fees', category: 'Fees', type: 'expense', amount: 542.0, account: 'Operating' },
  { id: 't6', date: '2026-11-17', description: 'Wholesale — Greenleaf', category: 'Sales', type: 'income', amount: 12450.0, account: 'Operating' },
  { id: 't7', date: '2026-11-16', description: 'Payroll — Operations team', category: 'Payroll', type: 'expense', amount: 18600.0, account: 'Payroll' },
  { id: 't8', date: '2026-11-15', description: 'Advertising — Meta', category: 'Marketing', type: 'expense', amount: 2400.0, account: 'Operating' },
  { id: 't9', date: '2026-11-15', description: 'POS daily deposits', category: 'Sales', type: 'income', amount: 3120.0, account: 'Operating' },
  { id: 't10', date: '2026-11-14', description: 'SaaS subscriptions', category: 'Tools', type: 'expense', amount: 680.0, account: 'Operating' },
];

export const cashflowSeries: SeriesPoint[] = [
  { label: 'Jul', value: 22 }, { label: 'Aug', value: 28 }, { label: 'Sep', value: 19 },
  { label: 'Oct', value: 34 }, { label: 'Nov', value: 41 }, { label: 'Dec', value: 38 },
];

export const expenseBreakdown: SeriesPoint[] = [
  { label: 'Inventory', value: 38 },
  { label: 'Payroll', value: 31 },
  { label: 'Operations', value: 14 },
  { label: 'Marketing', value: 11 },
  { label: 'Tools', value: 6 },
];

export const assistantSeed: ChatMessage[] = [
  { id: 'm1', role: 'assistant', content: "Good morning, Alex. Here's your business briefing for today: revenue is up 12.4% week-over-week, and two products need restocking soon. What would you like to dive into?", time: '08:42' },
];

export const assistantSuggestions = [
  'Which products should I restock this week?',
  'Summarize last month\'s finances',
  'Who are my most valuable customers?',
  'Forecast next quarter revenue',
];

export const assistantReplies: string[] = [
  "Based on current velocity, I'd restock Pulse Fitness Band and Nimbus Smart Bottle — both are at or below reorder level and demand is steady. Projected restock cost is around $3,200, which keeps 14 days of cover.",
  "Last month you brought in $128,450 in revenue against $79,200 in expenses, for a net margin of 38.4%. Inventory and payroll were your largest cost centers. Cash position improved by $24k.",
  "Your top three by lifetime value are Greenleaf Wholesale ($12,450), Priya Sharma ($3,480), and Sofia Almeida ($2,110). Priya has the highest order frequency at 24 orders this year.",
  "Projecting current trends forward, next quarter revenue should land between $138k–$152k, with the highest growth in Electronics and Apparel. I'd plan inventory around the upper bound to avoid stockouts.",
  "I noticed Emma Wright hasn't ordered in 47 days — she was previously a loyal customer. A targeted 15% win-back offer could recover that relationship at low cost.",
];
