import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import SiteSettings from '../models/SiteSettings.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import { renderIndexHtml } from '../utils/renderIndexHtml.js';

const router = Router();

// server/ is the process cwd (see the /uploads static path above, which resolves the same way) -
// so the built client sits one level up. Override with CLIENT_DIST_PATH if that ever changes.
const DIST_INDEX = path.resolve(process.env.CLIENT_DIST_PATH || '../client/dist', 'index.html');

// Serves the SPA shell for every non-API, non-upload route, with the <title>/meta
// description/og:*/twitter:* tags rewritten per-request from live SiteSettings (and, on a
// project/achievement/links page, that item's own title, summary and image). Link-preview
// crawlers (WhatsApp, Facebook, Twitter/X, Slack, LinkedIn...) never execute JS, so without
// this the share card is frozen at whatever was baked into index.html at build time - this
// is what makes the "change the share image myself from admin" setting actually take effect.
// Requires nginx's `location /` to fall back to this route (via `try_files $uri @node;`)
// for paths that aren't a real file in client/dist - see DEPLOY.md.
router.get(/^(?!\/api\/|\/uploads\/).*/, async (req, res, next) => {
  let template;
  try {
    template = fs.readFileSync(DIST_INDEX, 'utf-8');
  } catch {
    return next(); // no build on disk yet (e.g. local dev without `npm run build`)
  }

  const settings = (await SiteSettings.findOne().lean()) || {};
  const base = (settings.siteUrl || 'https://denisjovitusbuberwa.djb.co.tz').replace(/\/$/, '');
  const overrides = { settings, url: `${base}${req.path}` };

  try {
    const projectSlug = req.path.match(/^\/projects\/([^/]+)\/?$/)?.[1];
    const achievementSlug = req.path.match(/^\/achievements\/([^/]+)\/?$/)?.[1];

    if (projectSlug) {
      const project = await Project.findOne({ slug: projectSlug }).lean();
      if (project) {
        overrides.title = `${project.title} — ${settings.fullName || 'Denis Jovitus Buberwa'}`;
        overrides.description = project.summary;
        overrides.image = project.thumbnail || project.images?.[0];
      }
    } else if (achievementSlug) {
      const achievement = await Achievement.findOne({ slug: achievementSlug }).lean();
      if (achievement) {
        overrides.title = `${achievement.title} — ${settings.fullName || 'Denis Jovitus Buberwa'}`;
        overrides.description = achievement.summary;
        overrides.image = achievement.images?.[0];
      }
    } else if (req.path === '/links') {
      overrides.title = `Connect with ${settings.fullName || 'Denis Jovitus Buberwa'}`;
      overrides.description = settings.linksPageSubtitle || settings.tagline;
    }
  } catch {
    // DB lookup failed - fall through and still render the generic, settings-based tags below.
  }

  res.set('Content-Type', 'text/html');
  res.send(renderIndexHtml(template, overrides));
});

export default router;
