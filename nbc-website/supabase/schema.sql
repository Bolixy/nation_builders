-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  phone text,
  location text,
  track text,
  about text
);

-- Event and outreach registrations, and "notify me" interest forms
create table if not exists signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null,          -- event | outreach | event-interest | outreach-interest
  item text,                   -- title of the event or outreach
  name text not null,
  email text not null,
  phone text
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null
);

-- Security: visitors may ONLY add rows. Nobody can read them from the website.
-- You view the data in the Supabase dashboard (Table Editor).
alter table members  enable row level security;
alter table signups  enable row level security;
alter table messages enable row level security;

create policy "anyone can register" on members  for insert to anon with check (true);
create policy "anyone can sign up"  on signups  for insert to anon with check (true);
create policy "anyone can message"  on messages for insert to anon with check (true);
