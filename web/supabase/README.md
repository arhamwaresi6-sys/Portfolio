# Project manager setup

The portfolio reads published projects from the `portfolio_projects` table and stores project images, videos, and the homepage portrait in the private `portfolio-project-media` bucket. Database writes, uploads, and draft media are restricted by row-level security to `arhamwaresi6@gmail.com`; published media is served through short-lived signed URLs.

1. Copy `.env.example` to `.env.local` in `web/` and add the Supabase project URL and publishable key.
2. In the Supabase SQL Editor, run every SQL file in `migrations/` in filename order. If the project migration was already applied, run the new profile image migration.
3. In Supabase Auth URL Configuration, allow `/auth/callback` for your local site and deployed portfolio URL.
4. Open `/admin` and request the one-time sign-in link for the owner inbox. Edit a project with **Edit all details**, or replace the homepage portrait in the **Website portrait** section.

The login link uses Supabase email authentication. Do not add a service-role key to the website environment; the publishable key is protected by the database and Storage policies in the migration.
