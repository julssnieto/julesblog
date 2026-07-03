# Jules' Blog

A personal blog + portfolio site. Plain HTML/CSS/JS — no build step, no npm install required. Posts and categories are stored in [Supabase](https://supabase.com) (Postgres + Auth) so anyone visiting the site can read published posts, while only the signed-in admin can write, edit, delete posts, or manage categories.

## How it's built

- `index.html`, `css/style.css` — the page shell and all styling (ported 1:1 from the original design mockup).
- `js/app.js` — the app: routing, state, event handling.
- `js/api.js` — all reads/writes to Supabase (posts, categories, auth).
- `js/sanitize.js` — cleans post HTML before it's saved and again before it's shown, so the rich-text editor can never be used to inject a script into the site.
- `js/views/` — the four pages: home (blog list), post (reading view), write (editor), about (portfolio).
- Until real Supabase credentials are added to `js/supabaseClient.js`, the site runs in **dev mode**: it shows sample posts from memory instead of talking to a database, so it can be previewed before the backend exists.

## Setup — one-time steps

### 1. Create a free Supabase project
1. Go to [supabase.com](https://supabase.com) and sign up (free).
2. Click **New project**. Pick any name/region, set a database password (save it somewhere safe — you won't need it day-to-day), and wait ~2 minutes for it to finish provisioning.

### 2. Create the database tables
1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Paste in the entire contents of [`schema.sql`](./schema.sql) from this folder.
3. Click **Run**. This creates the `posts` and `categories` tables with the right access rules, and seeds the five starting categories.

### 3. Create your admin login
1. In the dashboard, open **Authentication** → **Users** → **Add user**.
2. Enter the email and password you want to sign in with on the live site.
3. Turn **on** "Auto Confirm User" (no confirmation email will be sent, since there's no email server configured — this avoids getting stuck waiting on an email that never arrives).
4. Click **Create user**.

This is the *only* way an admin account gets created — there's no "sign up" button anywhere on the site itself, so nobody else can ever claim admin access.

### 4. Connect the site to your project
1. In the dashboard, open **Settings** → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open `js/supabaseClient.js` and replace the two placeholder values (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) with the ones you copied.

The anon key is meant to be public — it's safe to commit to a public GitHub repo. Access control is enforced by the database's Row Level Security rules (in `schema.sql`), not by keeping this key secret.

### 5. Deploy
1. Put this whole folder in a GitHub repository (public is fine).
2. Create a free account at [netlify.com](https://netlify.com).
3. **Add new site** → **Import an existing project** → connect GitHub → pick the repo.
4. Leave the build command blank and set the publish directory to `.` (or `/`).
5. Click **Deploy**. Netlify gives you a free `yoursite.netlify.app` address — you can rename it for free in Site settings, or attach a custom domain later.

### 6. Verify it actually works
1. Visit your live site, click **Admin** in the footer, sign in.
2. Publish a test post.
3. Open the same URL in an incognito/private window (or ask someone else to check). You should see the post **without** being signed in, and you should **not** see any Write/Edit/Delete buttons anywhere as a signed-out visitor.

## Writing posts

- **Drafts**: the write view has two save buttons — "Save as draft" keeps a post hidden from everyone but you (signed in), "Publish" makes it public. Drafts show a small "Draft" badge only you can see, and are never picked as the featured post.
- **Sources**: below the editor, add any number of title + URL rows for further reading — they render as a linked list at the bottom of the published post.

## A quirk to know about

Supabase's free tier pauses a project after **7 days with no activity**. If the site ever shows an error loading posts after a quiet stretch, open the Supabase dashboard — there will be a one-click **Restore** button. No data is lost, it's just paused.

## Making future edits

- **Content edits** (new posts, categories): just use the site's admin/write UI — no code changes needed.
- **Design/text changes** (colors, copy, the About/portfolio timeline in `js/timelineData.js`): edit the files and push to GitHub — Netlify redeploys automatically within a minute or two.
