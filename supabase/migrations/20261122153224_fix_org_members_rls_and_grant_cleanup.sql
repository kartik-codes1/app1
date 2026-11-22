/*
# Security Fix: org_members INSERT/DELETE policies + grant cleanup

## Overview
Fixes a critical privilege escalation vulnerability in the `org_members` INSERT
policy and hardens the DELETE policy. Also revokes unnecessary `anon` grants on
all authenticated-only tables and removes the unused DELETE grant on `profiles`.

## Security Issue Fixed

### CRITICAL — org_members INSERT self-addition
The original INSERT policy allowed any authenticated user to insert a row with
their own `user_id` into ANY organization's `org_id`:

    with check (
      user_id = auth.uid()                    -- allowed self-insert into any org
      or exists (... owner/admin check ...)
    )

The `user_id = auth.uid()` branch did not verify that the caller was already a
member of the target org. This let an attacker join any organization without
authorization, gaining read/write access to all of that org's business data.

**Fix:** Remove the `user_id = auth.uid()` branch. The only legitimate paths to
create an org_members row are now:
  1. `bootstrap_organization` (SECURITY DEFINER, bypasses RLS) — for new org creation
  2. An existing owner/admin of the org adding a new member via the owner/admin check

### MEDIUM — org_members DELETE self-removal
The DELETE policy had the same `user_id = auth.uid()` branch, letting members
remove themselves without owner/admin consent. Fixed for consistency: only
owners/admins can remove members.

## Grant Cleanup

- Revoke ALL privileges from `anon` on every table. All policies are `TO authenticated`
  only, so `anon` had grants but no matching policies — granting nothing was the
  effective state already. This is defense-in-depth.
- Revoke DELETE from `authenticated` on `profiles`. There is no DELETE policy on
  profiles (deletion happens via `auth.users` ON DELETE CASCADE), so the grant
  was unused.

## Tables Modified
- `org_members`: INSERT and DELETE policies replaced
- `organizations`, `org_members`, `profiles`, `products`, `customers`, `orders`,
  `order_items`, `transactions`: anon grants revoked

## Important Notes
1. `bootstrap_organization` is unaffected — it runs as SECURITY DEFINER and
   bypasses RLS, so new org creation still works.
2. No frontend changes are needed. The signup flow already uses the RPC.
3. This migration is idempotent — policies are dropped before recreating.
*/

-- ============================================================
-- Fix org_members INSERT policy
-- ============================================================
drop policy if exists "members_insert_own" on org_members;

create policy "members_insert_own" on org_members
  for insert to authenticated
  with check (
    exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
      and m2.role in ('owner','admin')
    )
  );

-- ============================================================
-- Fix org_members DELETE policy
-- ============================================================
drop policy if exists "members_delete_own" on org_members;

create policy "members_delete_own" on org_members
  for delete to authenticated
  using (
    exists (
      select 1 from org_members m2
      where m2.org_id = org_members.org_id
      and m2.user_id = auth.uid()
      and m2.role in ('owner','admin')
    )
  );

-- ============================================================
-- Revoke anon grants on all authenticated-only tables
-- ============================================================
revoke select, insert, update, delete on organizations from anon;
revoke select, insert, update, delete on org_members from anon;
revoke select, insert, update, delete on profiles from anon;
revoke select, insert, update, delete on products from anon;
revoke select, insert, update, delete on customers from anon;
revoke select, insert, update, delete on orders from anon;
revoke select, insert, update, delete on order_items from anon;
revoke select, insert, update, delete on transactions from anon;

-- ============================================================
-- Remove unused DELETE grant on profiles (no DELETE policy exists)
-- ============================================================
revoke delete on profiles from authenticated;
