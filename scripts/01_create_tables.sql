-- Enable required extensions (if not already enabled)
-- Note: gen_random_uuid is available via pgcrypto; if missing, use uuid-ossp
create extension if not exists "pgcrypto";

-- SETTINGS table (key-value)
create table if not exists public.settings (
  key text primary key,
  value jsonb
);

-- REGISTRATIONS (unapproved)
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  team_name text not null,
  theme text not null check (theme in ('circuit','non-circuit')),
  team_size int not null check (team_size between 2 and 4),
  members jsonb not null,
  amount int not null,
  txn_id text,
  payment_proof_url text,
  status text not null default 'unapproved',
  event_code text not null default 'codeathon-2.0'
);

-- APPROVED MEMBERS
create table if not exists public.approved_members (
  id uuid primary key default gen_random_uuid(),
  approved_at timestamptz not null default now(),
  team_name text not null,
  theme text not null check (theme in ('circuit','non-circuit')),
  team_size int not null check (team_size between 2 and 4),
  members jsonb not null,
  amount int not null,
  txn_id text,
  payment_proof_url text,
  event_code text not null default 'codeathon-2.0'
);

-- RLS: disable by default; access through service role via server actions
alter table public.settings enable row level security;
alter table public.registrations enable row level security;
alter table public.approved_members enable row level security;

-- Policies: deny all for anon by default (implicit when no policies). Add explicit restrictive policies.
drop policy if exists "deny_all_settings" on public.settings;
create policy "deny_all_settings" on public.settings as restrictive for all to anon using (false) with check (false);

drop policy if exists "deny_all_registrations" on public.registrations;
create policy "deny_all_registrations" on public.registrations as restrictive for all to anon using (false) with check (false);

drop policy if exists "deny_all_approved" on public.approved_members;
create policy "deny_all_approved" on public.approved_members as restrictive for all to anon using (false) with check (false);
