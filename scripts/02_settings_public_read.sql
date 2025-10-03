// Enable read access for anon and authenticated users so /api/settings using anon can return DB values.

-- Idempotent cleanup of existing policies with same names
drop policy if exists "read_settings_anon" on public.settings;
drop policy if exists "read_settings_auth" on public.settings;

-- Allow select for anon and authenticated roles
create policy "read_settings_anon" on public.settings
as permissive
for select
to anon
using (true);

create policy "read_settings_auth" on public.settings
as permissive
for select
to authenticated
using (true);
