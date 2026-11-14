create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  short_description text not null,
  category text not null default 'General',
  overview text not null default '',
  problem text not null default '',
  solution text not null default '',
  description text not null default '',
  features text[] not null default array[]::text[],
  challenges text not null default '',
  implementation_notes text not null default '',
  tech_stack text[] not null default array[]::text[],
  live_url text,
  github_url text,
  video_url text,
  image_paths text[] not null default array[]::text[],
  video_path text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_project_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_project_updated_at on public.portfolio_projects;
create trigger set_project_updated_at
before update on public.portfolio_projects
for each row
execute function public.set_project_updated_at();

create index if not exists portfolio_projects_public_order_idx
on public.portfolio_projects (published, featured, sort_order, created_at desc);

alter table public.portfolio_projects enable row level security;

drop policy if exists "Published projects are publicly readable" on public.portfolio_projects;
create policy "Published projects are publicly readable"
on public.portfolio_projects
for select
to anon, authenticated
using (
  published
  or lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com'
);

drop policy if exists "Owner manages projects" on public.portfolio_projects;
create policy "Owner manages projects"
on public.portfolio_projects
for all
to authenticated
using (lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com')
with check (lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com');

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-project-media',
  'portfolio-project-media',
  false,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do nothing;

drop policy if exists "Published project media is readable" on storage.objects;
create policy "Published project media is readable"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'portfolio-project-media'
  and (
    lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com'
    or exists (
      select 1
      from public.portfolio_projects
      where public.portfolio_projects.published
        and (
          storage.objects.name = any(public.portfolio_projects.image_paths)
          or storage.objects.name = public.portfolio_projects.video_path
        )
    )
  )
);

drop policy if exists "Owner uploads project media" on storage.objects;
create policy "Owner uploads project media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-project-media'
  and lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com'
);

drop policy if exists "Owner updates project media" on storage.objects;
create policy "Owner updates project media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-project-media'
  and lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com'
)
with check (
  bucket_id = 'portfolio-project-media'
  and lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com'
);

drop policy if exists "Owner deletes project media" on storage.objects;
create policy "Owner deletes project media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-project-media'
  and lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com'
);
