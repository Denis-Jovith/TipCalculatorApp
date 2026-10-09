# Denis Jovitus Buberwa — Portfolio (MERN + PWA)

The full-stack, self-managed evolution of the [MyPortFolio](https://github.com/Denis-Jovith/MyPortFolio) Android app —
rebuilt as a MERN stack Progressive Web App with a real database-backed admin CMS. Every section of the public
site (hero, about, skills, experience, education, projects, social links, SEO) is editable from `/admin` — no
redeploys needed to update content.

Also known as: **Denis Jovitus Buberwa** · **Denis Jovith** · **Captain D** · **DJB** · **Denis Buberwa** ·
**Denis-Jovith**.

## Stack

- **Frontend**: React 18 + Vite, Tailwind CSS, Framer Motion, React Router, Tiptap (rich-text editor),
  `vite-plugin-pwa` (installable, offline-capable PWA)
- **Backend**: Node.js + Express + MongoDB (Mongoose), JWT auth, Multer file uploads, Nodemailer
- **Monorepo layout**: `client/` (React app) + `server/` (API)

## Features

- **Public site**: hero with an auto-playing, pausable profile photo carousel (add one photo or several — 2+
  turns it into a crossfading slideshow) and a rotating role marquee (Software Developer, Cybersecurity
  Enthusiast, Blockchain Explorer, AI Agents Professional, …), About, categorized Skills with progress bars, an
  animated Experience/Education timeline (each gets its own nav link and a distinct glow-pulse entrance), a
  tabbed Project gallery (Web / Mobile / Blender / Other) with an in-page **live preview modal** (scroll a live
  project right inside the site, or open it in a new tab) and a Blender/3D showreel video player, an
  **Achievements & Milestones** section for certifications, awards, and memorable career moments — each with its
  own shareable page, an optional photo carousel/video/downloadable document, a Share button, and (if you enable
  it per item) a comment section — a **Recommendations** section of structured testimonials from people Denis has
  worked with (name, title, company, how they met, a message, a 1–5 star rating, a thumbs up/down "would recommend",
  and an optional photo) plus an optional private email/phone so Denis can follow up — never shown publicly, only
  visible in the admin — each moderated before it goes live — a Connect section with a contact form + social icon
  bar styled after the original Android app's bottom bar, and a footer with every piece of its text (copyright
  symbol, year, tagline, aka label and names) independently editable and optional.
- **Configurable video highlights**: Project showreels and Achievement videos support an admin-set start time,
  end time, and default muted state, so only the best clip plays — the underlying file is never trimmed, and
  replaying always restarts from the configured start point rather than 0:00 or wherever playback was left off.
- **Same-tab external links**: GitHub/LinkedIn/social links, project live/repo links, and the resume link open in
  the same tab site-wide, so the browser's native Back button always returns a visitor to the portfolio.
- **Light/dark theme toggle**: every visit starts in light mode; toggling only changes it for that session — a
  reload or a fresh visit always resets back to light, with no flash of the wrong theme on load.
- **Accessibility**: skip-to-content link, visible focus rings, semantic landmarks and ARIA labels throughout,
  a keyboard-accessible live-preview modal (focus moves in, Escape closes it), labelled form fields, and full
  support for `prefers-reduced-motion` (dampens/disables animations site-wide for visitors who need it).
- **Admin CMS** (`/admin`): JWT-protected dashboard to create/read/update/delete every Project, Achievement,
  Skill, Experience entry, Education entry, and Social link — each with one-click ▲▼ reordering so you control
  exactly what shows first; a Comments screen to approve/reject/delete comments left on achievements (new
  comments are held for review, never shown publicly until approved — no one can comment without your say-so); a
  Recommendations screen to review, edit, reorder, and approve/reject testimonials before they appear publicly
  (recommendations you add yourself from the admin are auto-approved); edit all site-wide text (name, aka names,
  tagline, nav labels, hero buttons, every section title/subtitle, footer tagline, About Me, contact info, SEO
  fields) from one Settings screen; set each video's highlight start/end time and default mute state right next
  to its upload field; upload images/video/PDF/documents directly from the browser; and read contact-form
  submissions in a Messages inbox.
- **Multi-user admin, with real security**: up to 3 admin accounts. Every account is invited by an existing admin
  (no public self-registration) and must verify its email + set its own password via a time-limited emailed link
  before it can sign in. Forgot-password is opt-out per account (an admin can turn it off for any user) and always
  responds identically whether or not the email matches an account, so it can't be used to probe who has access.
  Invite/reset tokens are single-use, expire (48h / 1h), and only a hash of each is ever stored — the raw token
  exists only in the emailed link. Rate-limited login/invite/reset endpoints, bcrypt-hashed passwords, and a guard
  that blocks removing or disabling the last remaining active admin account round out the hardening.
- **Rich text editor**: a Gmail/Word-style toolbar (bold, italic, underline, headings, lists, quote, alignment,
  links) plus image and video insertion — uploaded media can be aligned left/center/right so it wraps with the
  surrounding text, and YouTube links can be embedded directly.
- **PWA**: installable on desktop and mobile (`beforeinstallprompt` banner included), works offline for
  already-visited content via a Workbox service worker, has a proper manifest and icons.
- **SEO**: per-page meta tags, Open Graph/Twitter cards, `Person` JSON-LD structured data (including `knowsAbout`)
  listing every name variant as `alternateName`, an `llms.txt` for AI answer engines, a dynamically generated
  `/sitemap.xml` and `/robots.txt` (regenerated from live DB content), and on-page aka-names text so search
  engines see every name as real content.

## Project structure

```
client/            React + Vite PWA
  src/components/  Hero, About, Skills, Projects, ContactSection, SocialBar, richtext/ (Tiptap editor), admin/
  src/pages/        Home, ProjectDetail, admin/ (CMS screens)
  public/seed/       Real photos/video migrated from the original MyPortFolio Android app

server/            Express + MongoDB API
  src/models/       User, SiteSettings, Project, Skill, Experience, Education, SocialLink, Message
  src/routes/        auth, projects, skills, experience, education, social-links, settings, upload, messages, seo
  src/utils/seed.js  Seeds the database with content derived from your CV + MyPortFolio on first boot
```

## Getting started

**Prerequisites**: Node.js 18+, and a MongoDB connection string — the easiest option is a free
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (takes ~5 minutes to create).

```bash
npm run install:all          # installs root, client and server dependencies

cp server/.env.example server/.env
# edit server/.env:
#   MONGO_URI      — your Atlas (or self-hosted) connection string
#   JWT_SECRET     — any long random string
#   ADMIN_EMAIL / ADMIN_PASSWORD — your admin login (created automatically on first run)

npm run dev                  # runs the API (port 5000) and the client (port 5173) together
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` to sign in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you set. The database is seeded automatically on first boot with content pulled
from your CV and the original MyPortFolio app — edit or replace any of it from the admin dashboard.

> If `ADMIN_PASSWORD` is left unset, the server creates the admin account with a default password and prints a
> warning in the server logs — log in and change it immediately from a real deployment.

### Optional: email notifications for the contact form

Contact-form messages are always saved and visible in `/admin/messages`. To also get them emailed to you, fill in
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `CONTACT_TO_EMAIL` in `server/.env` (any SMTP provider —
Gmail app password, SendGrid, Mailgun, etc. all work).

## Deploying

**Deploying to your own server (self-hosted, Nginx + PM2)?** See [`DEPLOY.md`](./DEPLOY.md) for a full,
copy-pasteable runbook — this is what you want if you're putting it on `/var/www/djbportfolio` at
`denisjovitusbuberwa.djb.co.tz` alongside your other sites.

Otherwise, this is a standard two-service platform deployment:

1. **Database**: a MongoDB Atlas cluster (free tier is enough to start).
2. **API** (`server/`): deploy to Render, Railway, Fly.io, or any Node host. Set the same environment variables
   as `.env.example`, plus `NODE_ENV=production` and `CLIENT_URL` set to your deployed frontend's origin.
3. **Frontend** (`client/`): deploy to Vercel, Netlify, or Cloudflare Pages. Set a rewrite/proxy so `/api/*`,
   `/uploads/*`, `/sitemap.xml` and `/robots.txt` forward to your API's origin (e.g. a Vercel `rewrites` rule or
   an Nginx reverse proxy) — this keeps `yourdomain.com/sitemap.xml` reachable at the domain root, which is where
   search engines look for it.
4. Update `siteUrl` in **Admin → Site Settings** to your real domain so the sitemap and structured data use the
   correct URL.

## Notes on this build

- The 42 MB Blender showreel video and project screenshots were migrated as-is from the original
  `MyPortFolio` repo into `client/public/seed/`. Swap them for compressed versions any time via the admin
  Projects screen — they're just files referenced by URL, not baked into the app.
- The dev/test environment this was built in blocks outbound access to MongoDB's binary-download host, so an
  in-memory "zero-setup" database mode was intentionally **not** shipped — `MONGO_URI` is required in all
  environments, which also matches "real backend" rather than a throwaway one.
