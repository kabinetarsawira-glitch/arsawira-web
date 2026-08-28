create table if not exists public.design_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  division text not null,
  contact text,
  service_id text not null,
  event_name text,
  deadline date not null,
  publication_date date,
  brief text not null,
  drive_link text,
  notes text,
  status text not null default 'Waiting',
  created_at timestamptz not null default now()
);

alter table public.design_requests enable row level security;

create policy "allow public request inserts"
on public.design_requests
for insert
to anon
with check (true);

-- Jangan buat policy SELECT untuk anon jika request bersifat internal.
-- Dashboard admin sebaiknya memakai autentikasi Supabase.
