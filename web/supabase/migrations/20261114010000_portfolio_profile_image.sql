create table if not exists public.portfolio_site_settings (
  id text primary key check (id = 'main'),
  profile_image_path text,
  updated_at timestamptz not null default now()
);

insert into public.portfolio_site_settings (id)
values ('main')
on conflict (id) do nothing;

create or replace function public.set_portfolio_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_portfolio_settings_updated_at on public.portfolio_site_settings;
create trigger set_portfolio_settings_updated_at
before update on public.portfolio_site_settings
for each row
execute function public.set_portfolio_settings_updated_at();

alter table public.portfolio_site_settings enable row level security;

drop policy if exists "Portfolio settings are publicly readable" on public.portfolio_site_settings;
create policy "Portfolio settings are publicly readable"
on public.portfolio_site_settings
for select
to anon, authenticated
using (id = 'main');

drop policy if exists "Owner manages portfolio settings" on public.portfolio_site_settings;
create policy "Owner manages portfolio settings"
on public.portfolio_site_settings
for all
to authenticated
using (lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com')
with check (lower(auth.jwt() ->> 'email') = 'arhamwaresi6@gmail.com');

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
    or exists (
      select 1
      from public.portfolio_site_settings
      where public.portfolio_site_settings.id = 'main'
        and public.portfolio_site_settings.profile_image_path = storage.objects.name
    )
  )
);
