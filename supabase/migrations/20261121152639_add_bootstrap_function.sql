/*
# Org Bootstrap Function

## Overview
Adds a SECURITY DEFINER RPC `bootstrap_organization` that atomically creates:
1. A `profiles` row for the new auth user (full_name + initials)
2. An `organizations` row owned by the user
3. An `org_members` row making the user the owner of that org

This runs right after signup from the frontend. It's SECURITY DEFINER so it can
insert into all three tables in a single atomic call regardless of RLS ordering
concerns (e.g. org_members INSERT needing the org to exist and the caller to be
a member — the function bypasses that chicken-and-egg by running as the definer).

## Security
- SECURITY DEFINER, search_path locked to public
- EXECUTE revoked from PUBLIC and anon; granted to authenticated only
- Only operates for the calling auth user (uses auth.uid() for user_id and created_by)
- Returns the new org id as a uuid

## Parameters
- `org_name` (text) — the workspace/company name
- `full_name` (text, nullable) — the user's display name

## Returns
- uuid — the id of the newly created organization
*/

create or replace function bootstrap_organization(org_name text, full_name text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  new_user uuid := auth.uid();
  initials text;
begin
  if new_user is null then
    raise exception 'Not authenticated';
  end if;

  -- Compute initials from full_name or fall back to first two chars of the uuid-ish email
  initials := coalesce(
    upper(substr(split_part(full_name, ' ', 1), 1, 1) || substr(split_part(full_name, ' ', 2), 1, 1)),
    ''
  );

  -- Upsert profile
  insert into profiles (id, full_name, avatar_initials)
  values (new_user, full_name, initials)
  on conflict (id) do update
    set full_name = excluded.full_name,
        avatar_initials = excluded.avatar_initials;

  -- Create the organization
  insert into organizations (name, created_by)
  values (org_name, new_user)
  returning id into new_org_id;

  -- Add the user as owner
  insert into org_members (org_id, user_id, role)
  values (new_org_id, new_user, 'owner');

  return new_org_id;
end;
$$;

revoke execute on function bootstrap_organization(text, text) from public, anon;
grant execute on function bootstrap_organization(text, text) to authenticated;
