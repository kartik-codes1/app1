# Project memory

## Product intent & audience

- BizPilot AI: multi-tenant SaaS for small/medium business management.
- Core domain entities: organizations, org_members, products, customers, orders, order_items, transactions.
- Planned features (not yet started): AI agents, WhatsApp integration.

## Brand personality & voice

- User communicates with technical precision; values careful, audited changes over rapid implementation.
- Prefers reports before action; dislikes unnecessary code changes.

## Visual design & UX direction

- Frontend is considered stable — user explicitly requested no redesign or component deletion.
- No specific aesthetic inferences yet; design guidance comes from `.bolt/prompt`.

## Decisions, constraints & rationale

- **Supabase stack**: React + Vite + TypeScript + Tailwind + Lucide React; `@/` path alias → `src/`.
- **Multi-tenant isolation via RLS**: all business tables scope through `is_org_member(org_id)` SECURITY DEFINER function.
- **Org creation**: exclusively via `bootstrap_organization` RPC (SECURITY DEFINER, bypasses RLS); called from `signUp` after `supabase.auth.signUp()` with a ~400 ms delay for DB availability.
- **org_members INSERT policy fixed**: removed `user_id = auth.uid()` branch that allowed any authenticated user to self-add to arbitrary orgs; now requires existing owner/admin membership.
- **org_members DELETE policy fixed**: removed self-removal branch; only owners/admins can remove members.
- **anon role**: all table grants revoked (defense-in-depth; no anon policies existed).
- **profiles table**: DELETE grant removed (no DELETE policy existed).
- **Frontend keys**: only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` used; service role key never referenced.
- **Verified safe**: no recursive RLS; cross-org isolation enforced; two SECURITY DEFINER advisor warnings are intentional.

## Open questions & assumptions

- Environment variables are injected at runtime by hosting layer; no `.env` on disk.
- `is_org_member` and `bootstrap_organization` SECURITY DEFINER functions are trusted; future schema changes must preserve their security properties.
- AI agents and WhatsApp integration are deferred until explicitly requested.
- No invite-email flow implemented yet; member addition is direct INSERT by owner/admin (may need invitation mechanism later).