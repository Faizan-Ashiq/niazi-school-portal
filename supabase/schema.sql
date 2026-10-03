create type user_role as enum ('principal','teacher','student');
create type audience as enum ('all','students','teachers');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null, roll_number text, class_name text, email text,
  role user_role not null default 'student', created_at timestamptz default now());
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null, content text not null,
  target_audience audience not null default 'all',
  pinned boolean not null default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now());
create table diary_homework (
  id uuid primary key default gen_random_uuid(),
  class_name text not null, subject text not null, description text not null,
  date date not null default current_date, attachment_url text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now());
create table past_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null, class_name text not null, file_url text not null,
  uploaded_by_role text, created_at timestamptz default now());
create table school_settings (
  id uuid primary key default gen_random_uuid(),
  youtube_url text, whatsapp_number text, contact_email text);
insert into school_settings (youtube_url, whatsapp_number, contact_email)
values ('https://youtube.com/@SchoolChannel', '+923001234567', 'info@school.com');

-- helpers (security definer avoids recursive RLS)
create function my_role() returns user_role language sql stable security definer set search_path=public
as $$ select role from profiles where id = auth.uid() $$;
create function my_class() returns text language sql stable security definer set search_path=public
as $$ select class_name from profiles where id = auth.uid() $$;

-- every sign-up becomes a STUDENT; roles are never taken from client metadata
create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles (id, full_name, roll_number, class_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''),
          new.raw_user_meta_data->>'roll_number', new.raw_user_meta_data->>'class_name', new.email, 'student');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security;
alter table announcements enable row level security;
alter table diary_homework enable row level security;
alter table past_papers enable row level security;
alter table school_settings enable row level security;

create policy "profiles read" on profiles for select using (id = auth.uid() or my_role() = 'principal');
create policy "profiles principal write" on profiles for all using (my_role() = 'principal') with check (my_role() = 'principal');

create policy "ann read" on announcements for select to authenticated using (
  my_role() = 'principal' or target_audience = 'all'
  or (target_audience = 'students' and my_role() = 'student')
  or (target_audience = 'teachers' and my_role() = 'teacher'));
create policy "ann principal write" on announcements for all using (my_role() = 'principal') with check (my_role() = 'principal');

create policy "diary read" on diary_homework for select to authenticated using (
  my_role() in ('principal','teacher') or class_name = my_class());
create policy "diary insert" on diary_homework for insert to authenticated with check (my_role() in ('principal','teacher'));
create policy "diary delete" on diary_homework for delete to authenticated using (my_role() = 'principal' or created_by = auth.uid());

create policy "papers read" on past_papers for select to authenticated using (
  my_role() in ('principal','teacher') or class_name = my_class());
create policy "papers insert" on past_papers for insert to authenticated with check (my_role() in ('principal','teacher'));
create policy "papers delete" on past_papers for delete to authenticated using (my_role() = 'principal');

create policy "settings read" on school_settings for select using (true);   -- landing page is public
create policy "settings update" on school_settings for update using (my_role() = 'principal');

-- storage
insert into storage.buckets (id, name, public) values ('files','files',true) on conflict do nothing;
create policy "files public read" on storage.objects for select using (bucket_id = 'files');
create policy "files staff upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'files' and my_role() in ('principal','teacher'));
create policy "files principal delete" on storage.objects for delete to authenticated
  using (bucket_id = 'files' and my_role() = 'principal');

-- ADMIN SEED: 1) Supabase Dashboard > Authentication > Users > Add user (principal & teachers)
-- 2) then promote them:
-- update profiles set role = 'principal' where email = 'principal@yourschool.edu';
-- update profiles set role = 'teacher'   where email = 'teacher@yourschool.edu';
