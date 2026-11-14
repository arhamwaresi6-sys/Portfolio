# Project manager setup

The portfolio reads published projects from the `portfolio_projects` table and stores project images, videos, and the homepage portrait in the private `portfolio-project-media` bucket. Database writes, uploads, and draft media are restricted by row-level security to `arhamwaresi6@gmail.com`; published media is served through short-lived signed URLs.

1. Copy `.env.example` to `.env.local` in `web/` and add the Supabase project URL and publishable key.
2. In the Supabase SQL Editor, run every SQL file in `migrations/` in filename order. If the project migration was already applied, run the new profile image migration.
3. In Supabase Auth URL Configuration, set the Site URL to your production portfolio URL and add its `/auth/callback` URL to Redirect URLs. For the current production domain, add `https://portfolio-gamma-seven-p683wuto68.vercel.app/auth/callback`. Add `http://localhost:3000/auth/callback` separately for local development.
4. Open `/admin` and request the one-time sign-in link for the owner inbox. Edit a project with **Edit all details**, or replace the homepage portrait in the **Website portrait** section.

The Supabase magic-link email template must use `{{ .ConfirmationURL }}` for its action link so Supabase returns through `/auth/callback` and the app can finish signing in before opening `/admin`. Using `{{ .SiteURL }}` sends the owner to the public homepage instead. After changing Auth URL or template settings, request a fresh sign-in link.

The login link uses Supabase email authentication. Do not add a service-role key to the website environment; the publishable key is protected by the database and Storage policies in the migration.
