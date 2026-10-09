# Deploying to `/var/www/djbportfolio` at denisjovitusbuberwa.djb.co.tz

This assumes a Linux server with Nginx already running other sites (you have `atclsaccos`, `html`, and
`staging` next to `djbportfolio` in `/var/www`), and that you manage `djb.co.tz` in Cloudflare. Run every
command below over SSH on `testserver`, as the `denis` user (use `sudo` where noted).

## 0. One-time server prerequisites

```bash
node -v          # need 18+; if missing or too old:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo npm install -g pm2      # process manager that keeps the API running & restarts on reboot
nginx -v                     # confirm Nginx is installed (it almost certainly already is)
```

You'll also need a MongoDB connection string — the free tier at
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) is the easiest option (~5 minutes to create a
cluster, add a database user, and allow network access from `0.0.0.0/0` or your server's IP).

## 1. Get the code onto the server

You have the zip I sent you. From your **local machine** (not the server):

```bash
scp denis-jovitus-buberwa-portfolio.zip denis@testserver:/var/www/djbportfolio/
```

Then on the **server**:

```bash
cd /var/www/djbportfolio
unzip denis-jovitus-buberwa-portfolio.zip && rm denis-jovitus-buberwa-portfolio.zip
```

Drop the Blender showreel video (excluded from the zip for size) into `client/public/seed/blender-showreel.mp4`
the same way (`scp` it up separately) if you want it live.

> Prefer Git going forward? Push this folder to a new GitHub repo of your own once, then on the server run
> `git clone <your-repo-url> .` instead of unzipping — future updates become `git pull` (step 8).

## 2. Configure the backend

```bash
cd /var/www/djbportfolio
cp server/.env.example server/.env
nano server/.env
```

Fill in:

```ini
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=<run: openssl rand -hex 32>
ADMIN_NAME=Denis Jovitus Buberwa
ADMIN_EMAIL=denisjovitusbuberwa@gmail.com
ADMIN_PASSWORD=<a real password — change it after first login regardless>
CLIENT_URL=https://denisjovitusbuberwa.djb.co.tz
```

Leave the `SMTP_*` lines blank unless you want contact-form emails (Gmail app password, SendGrid, etc. all work).

## 3. Install, build, seed

```bash
cd /var/www/djbportfolio
npm run install:all      # installs root + client + server deps
npm run build             # builds the React app into client/dist
```

The database seeds itself automatically the first time the API starts (step 4) — no separate seed command
needed, but `npm run seed` exists if you ever want to re-run it manually against a fresh database.

## 4. Run the API with PM2

```bash
cd /var/www/djbportfolio/server
pm2 start src/index.js --name djb-api
pm2 save
pm2 startup            # prints a command — copy/paste and run it once, so PM2 survives a reboot
```

Check it's alive:

```bash
pm2 status
curl http://localhost:5000/api/health   # should return {"status":"ok"}
```

## 5. Nginx: serve the site and proxy the API

> **Already have this site live from an earlier deploy?** The config below changed — `location /`
> now falls back to Node instead of serving `index.html` directly, so admin-edited share images/SEO
> titles actually reach link-preview crawlers. Edit your existing `/etc/nginx/sites-available/djbportfolio`
> to match it, then `sudo nginx -t && sudo systemctl reload nginx`. Nothing else in this step changes.

Create `/etc/nginx/sites-available/djbportfolio`:

```nginx
server {
    listen 80;
    server_name denisjovitusbuberwa.djb.co.tz;

    root /var/www/djbportfolio/client/dist;
    index index.html;

    client_max_body_size 65m;   # allow image/video/document uploads through Multer (60MB limit)

    # Real static files (JS/CSS chunks, icons, seed media, manifest, sw.js) are served straight
    # from disk as before - fast, and completely unaffected by the change below. Only a path that
    # ISN'T a real file (i.e. every SPA route: /, /links, /projects/:slug, /admin, ...) falls
    # through to Node, which renders index.html with that page's og:title/description/image
    # filled in live from Site Settings (see server/src/routes/render.js). Without this, link
    # previews (WhatsApp/Facebook/Twitter/Slack) would always show whatever was baked into
    # index.html at build time, no matter what you change in Admin -> Site Settings.
    location / {
        try_files $uri @node;
    }
    location @node {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Everything the Node API owns
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000;
    }
    location = /sitemap.xml {
        proxy_pass http://127.0.0.1:5000;
    }
    location = /robots.txt {
        proxy_pass http://127.0.0.1:5000;
    }
    location = /llms.txt {
        proxy_pass http://127.0.0.1:5000;
    }

    # Cache static build assets aggressively; index.html itself is never cached
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/djbportfolio /etc/nginx/sites-enabled/djbportfolio
sudo nginx -t          # must say "syntax is ok" / "test is successful"
sudo systemctl reload nginx
```

## 6. Cloudflare DNS + SSL

In the Cloudflare dashboard for the **djb.co.tz** zone:

1. **DNS → Add record**
   - Type: `A`
   - Name: `denisjovitusbuberwa`
   - IPv4 address: your server's public IP (same one `atclsaccos` already resolves to, if it's the same box)
   - Proxy status: **Proxied** (orange cloud) — gives you Cloudflare's CDN, DDoS protection, and lets Cloudflare
     terminate SSL for visitors.

2. **SSL/TLS → Overview**: set the encryption mode to **Full (strict)**.

3. **SSL/TLS → Origin Server → Create Certificate**: generate a free Cloudflare Origin Certificate (15-year
   validity), then install it on the server:

   ```bash
   sudo mkdir -p /etc/ssl/cloudflare
   sudo nano /etc/ssl/cloudflare/djb.co.tz.pem       # paste the certificate Cloudflare gave you
   sudo nano /etc/ssl/cloudflare/djb.co.tz.key       # paste the private key Cloudflare gave you
   ```

   Then add a second `server` block (or extend the one above) listening on 443 with:

   ```nginx
   listen 443 ssl;
   ssl_certificate     /etc/ssl/cloudflare/djb.co.tz.pem;
   ssl_certificate_key /etc/ssl/cloudflare/djb.co.tz.key;
   ```

   and redirect port 80 → 443. (`Full (strict)` won't work until this origin cert is in place — until then,
   use **Full** (not strict) or **Flexible** mode as a temporary fallback while you set it up.)

4. Reload Nginx again: `sudo nginx -t && sudo systemctl reload nginx`.

DNS usually propagates within a few minutes on Cloudflare. Confirm with:

```bash
dig denisjovitusbuberwa.djb.co.tz
curl -I https://denisjovitusbuberwa.djb.co.tz
```

## 7. Final checks

- Visit `https://denisjovitusbuberwa.djb.co.tz` — the site should load.
- Visit `/admin/login` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from step 2. **Change the
  password immediately** if you used a throwaway one.
- Visit `/sitemap.xml`, `/robots.txt` and `/llms.txt` — all three should return real content, not 404s.
- In **Admin → Site Settings**, the "Site URL" field should already read
  `https://denisjovitusbuberwa.djb.co.tz` — double check it matches exactly.
- Test the share preview: paste `https://denisjovitusbuberwa.djb.co.tz/links` into
  [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/) or
  [Twitter Card Validator](https://cards-dev.twitter.com/validator) and confirm it shows the image
  set in **Admin → Site Settings → SEO & link sharing → Link preview image** (set one there if
  it's still blank — WhatsApp/Facebook cache previews aggressively, so re-scrape after changing it).

## 8. Deploying updates later

```bash
cd /var/www/djbportfolio
git pull                        # or re-upload/unzip if you're not using git
npm run install:all
npm run build
pm2 restart djb-api
```

Nginx doesn't need touching for ordinary content/code updates — only if you change ports, add a new
subdomain, or adjust proxy rules.
