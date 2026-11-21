/*
# BizPilot AI — Core Multi-Tenant Schema

## Overview
Creates the foundational multi-tenant architecture for BizPilot AI. Every business
table (products, customers, orders, order_items, transactions) is scoped to an
organization via `org_id`. Users are linked to organizations through an
`org_members` junction table with role-based access (owner/admin/member).

## New Tables

1. `organizations` — company/workspace; `created_by` links to the auth user who made it
2. `org_members` — junction: user ↔ org with a role (owner/admin/member), unique per (org, user)
3. `profiles` — mirror of auth.users with display name + initials, keyed on auth.uid()
4. `products` — inventory items scoped by org_id
5. `customers` — customer records scoped by org_id
6. `orders` — orders scoped by org_id with order_number, status, channel, payment_status
7. `order_items` — line items scoped through the parent order's org (no direct org_id)
8. `transactions` — income/expense ledger scoped by org_id

## Security — RLS & Grants

All tables have RLS enabled. Business tables scope access through `is_org_member(org_id)`,
a SECURITY DEFINER helper that checks org_members for the current auth.uid().
- organizations: visible to creator or any member
- org_members: visible to the user themselves or any member of the same org; inserts/updates
  by the user themselves or an owner/admin of the org
- profiles: self-scoped (id = auth.uid())
- products / customers / orders / transactions: full CRUD gated on is_org_member(org_id)
- order_items: scoped through parent order via EXISTS subquery

Grants: CRUD to authenticated on all tables; SELECT to service_role for edge functions.
is_org_member EXECUTE is revoked from PUBLIC/anon, granted to authenticated only.

## Important Notes

1. Email confirmation stays OFF — users can sign up and sign in immediately.
2. `profiles.id` defaults to auth.uid() so a profile can be created right after signup.
3. Tables are created BEFORE policies so cross-table references in policy subqueries resolve.
4. `org_id` on business tables has no default — the frontend passes the active org id on insert.
   The INSERT WITH CHECK via is_org_member ensures the user belongs to that org.
*/

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. organizations (no policies yet — added after org_members exists)
-- ============================================================
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table organizations enable row level security;

grant select, insert, update, delete on organizations to authenticated;
grant select on organizations to service_role;

-- ============================================================
-- 2. org_members
-- ============================================================
create table if not exists org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

alter table org_members enable row level security;

grant select, insert, update, delete on org_members to authenticated;
grant select on org_members to service_role;

-- ============================================================
-- 3. profiles
-- ============================================================
create table if not exists profiles (
  id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  full_name text,
  avatar_initials text default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

grant select, insert, update on profiles to authenticated;
grant select on profiles to service_role;

-- ============================================================
-- 4. Helper: is_org_member (SECURITY DEFINER)
--    Defined before business-table policies so they can reference it.
-- ============================================================
create or replace function is_org_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from org_members
    where org_id = target_org
    and user_id = auth.uid()
  );
$$;

revoke execute on function is_org_member(uuid) from public, anon;
grant execute on function is_org_member(uuid) to authenticated;

-- ============================================================
-- 5. products
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  sku text not null,
  category text not null default 'Uncategorized',
  stock int not null default 0,
  reorder_level int not null default 0,
  price numeric(12,2) not null default 0,
  cost numeric(12,2) not null default 0,
  supplier text not null default '',
  status text not null default 'in-stock' check (status in ('in-stock','low-stock','out-of-stock')),
  trend int not null default 0,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

grant select, insert, update, delete on products to authenticated;
grant select on products to service_role;

-- ============================================================
-- 6. customers
-- ============================================================
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null default '',
  location text not null default '',
  orders_count int not null default 0,
  total_spent numeric(12,2) not null default 0,
  segment text not null default 'new' check (segment in ('vip','loyal','new','at-risk')),
  last_order_date date,
  avatar_initials text not null default '',
  created_at timestamptz not null default now()
);

alter table customers enable row level security;

grant select, insert, update, delete on customers to authenticated;
grant select on customers to service_role;

-- ============================================================
-- 7. orders
-- ============================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  order_number text not null,
  customer_name text not null,
  customer_email text not null default '',
  status text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  total numeric(12,2) not null default 0,
  channel text not null default 'web' check (channel in ('web','pos','marketplace','wholesale')),
  payment_status text not null default 'unpaid' check (payment_status in ('paid','unpaid','refunded')),
  order_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

grant select, insert, update, delete on orders to authenticated;
grant select on orders to service_role;

-- ============================================================
-- 8. order_items (scoped through parent order)
-- ============================================================
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  qty int not null default 1,
  price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table order_items enable row level security;

grant select, insert, update, delete on order_items to authenticated;
grant select on order_items to service_role;

-- ============================================================
-- 9. transactions
-- ============================================================
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  description text not null,
  category text not null default 'General',
  type text not null check (type in ('income','expense')),
  amount numeric(12,2) not null default 0,
  account text not null default 'Operating',
  txn_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table transactions enable row level security;

grant select, insert, update, delete on transactions to authenticated;
grant select on transactions to service_role;

-- ============================================================
-- POLICIES (all tables now exist, so cross-table refs are safe)
-- ============================================================

-- organizations
drop policy if exists "org_select_own" on organizations;
create policy "org_select_own" on organizations
  for select to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1 from org_members
      where org_members.org_id = organizations.id
      and org_members.user_id = auth.uid()
    )
  );

drop policy if exists "org_insert_own" on organizations;
create policy "org_insert_own" on organizations
  for insert to authenticated
  with check (created_by = auth.uid());

drop policy if exists "org_update_own" on organizations;
create policy "org_update_own" on organizations
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "org_delete_own" on organizations;
create policy "org_delete_own" on organizations
  for delete to authenticated
  using (created_by = auth.uid());

-- org_members
drop policy if exists "members_select_own" on org_members;
create policy "members_select_own" on org_members
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
    )
  );

drop policy if exists "members_insert_own" on org_members;
create policy "members_insert_own" on org_members
  for insert to authenticated
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
      and m2.role in ('owner','admin')
    )
  );

drop policy if exists "members_update_own" on org_members;
create policy "members_update_own" on org_members
  for update to authenticated
  using (
    exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
      and m2.role in ('owner','admin')
    )
  )
  with check (
    exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
      and m2.role in ('owner','admin')
    )
  );

drop policy if exists "members_delete_own" on org_members;
create policy "members_delete_own" on org_members
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
      and m2.role in ('owner','admin')
    )
  );

-- profiles
drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- products
drop policy if exists "products_select" on products;
create policy "products_select" on products
  for select to authenticated
  using (is_org_member(org_id));

drop policy if exists "products_insert" on products;
create policy "products_insert" on products
  for insert to authenticated
  with check (is_org_member(org_id));

drop policy if exists "products_update" on products;
create policy "products_update" on products
  for update to authenticated
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

drop policy if exists "products_delete" on products;
create policy "products_delete" on products
  for delete to authenticated
  using (is_org_member(org_id));

-- customers
drop policy if exists "customers_select" on customers;
create policy "customers_select" on customers
  for select to authenticated
  using (is_org_member(org_id));

drop policy if exists "customers_insert" on customers;
create policy "customers_insert" on customers
  for insert to authenticated
  with check (is_org_member(org_id));

drop policy if exists "customers_update" on customers;
create policy "customers_update" on customers
  for update to authenticated
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

drop policy if exists "customers_delete" on customers;
create policy "customers_delete" on customers
  for delete to authenticated
  using (is_org_member(org_id));

-- orders
drop policy if exists "orders_select" on orders;
create policy "orders_select" on orders
  for select to authenticated
  using (is_org_member(org_id));

drop policy if exists "orders_insert" on orders;
create policy "orders_insert" on orders
  for insert to authenticated
  with check (is_org_member(org_id));

drop policy if exists "orders_update" on orders;
create policy "orders_update" on orders
  for update to authenticated
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

drop policy if exists "orders_delete" on orders;
create policy "orders_delete" on orders
  for delete to authenticated
  using (is_org_member(org_id));

-- order_items (scoped through parent order)
drop policy if exists "items_select" on order_items;
create policy "items_select" on order_items
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and is_org_member(o.org_id)
    )
  );

drop policy if exists "items_insert" on order_items;
create policy "items_insert" on order_items
  for insert to authenticated
  with check (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and is_org_member(o.org_id)
    )
  );

drop policy if exists "items_update" on order_items;
create policy "items_update" on order_items
  for update to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and is_org_member(o.org_id)
    )
  )
  with check (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and is_org_member(o.org_id)
    )
  );

drop policy if exists "items_delete" on order_items;
create policy "items_delete" on order_items
  for delete to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
      and is_org_member(o.org_id)
    )
  );

-- transactions
drop policy if exists "txn_select" on transactions;
create policy "txn_select" on transactions
  for select to authenticated
  using (is_org_member(org_id));

drop policy if exists "txn_insert" on transactions;
create policy "txn_insert" on transactions
  for insert to authenticated
  with check (is_org_member(org_id));

drop policy if exists "txn_update" on transactions;
create policy "txn_update" on transactions
  for update to authenticated
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

drop policy if exists "txn_delete" on transactions;
create policy "txn_delete" on transactions
  for delete to authenticated
  using (is_org_member(org_id));

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_org_members_user on org_members(user_id);
create index if not exists idx_org_members_org on org_members(org_id);
create index if not exists idx_products_org on products(org_id);
create index if not exists idx_customers_org on customers(org_id);
create index if not exists idx_orders_org on orders(org_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_transactions_org on transactions(org_id);
