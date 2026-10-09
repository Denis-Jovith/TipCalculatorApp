import { Router } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import SocialLink from '../models/SocialLink.js';
import LiveApp from '../models/LiveApp.js';

const router = Router();

router.get('/sitemap.xml', async (_req, res) => {
  const settings = (await SiteSettings.findOne()) || {};
  const base = (settings.siteUrl || 'https://denisjovith.dev').replace(/\/$/, '');
  const projects = await Project.find({ published: true }).select('slug updatedAt');
  const achievements = await Achievement.find({ published: true }).select('slug updatedAt');

  const staticPaths = [
    '',
    '#about',
    '#skills',
    '#experience',
    '#education',
    '#projects',
    '#achievements',
    '#recommendations',
    '#connect',
    'projects',
    'achievements',
    'links'
  ];

  const urls = [
    ...staticPaths.map(
      (p) => `  <url>\n    <loc>${base}/${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p ? '0.7' : '1.0'}</priority>\n  </url>`
    ),
    ...projects.map(
      (p) =>
        `  <url>\n    <loc>${base}/projects/${p.slug}</loc>\n    <lastmod>${p.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    ),
    ...achievements.map(
      (a) =>
        `  <url>\n    <loc>${base}/achievements/${a.slug}</loc>\n    <lastmod>${a.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    )
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    '\n'
  )}\n</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

router.get('/robots.txt', async (_req, res) => {
  const settings = (await SiteSettings.findOne()) || {};
  const base = (settings.siteUrl || 'https://denisjovith.dev').replace(/\/$/, '');
  // `User-agent: *` already allows every crawler, AI ones included - these extra lines are
  // just explicit, so there's never any doubt that GPTBot/ClaudeBot/PerplexityBot/etc. are welcome.
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: anthropic-ai\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: CCBot\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`
  );
});

// A plain-text, AI-readable summary of who this site is about - the emerging "llms.txt"
// convention for answer engines/AI crawlers that prefer a short, structured brief over
// parsing full HTML. Built live from SiteSettings so it never drifts from the real content.
router.get('/llms.txt', async (_req, res) => {
  const settings = (await SiteSettings.findOne()) || {};
  const socialLinks = await SocialLink.find({ visible: true }).sort('order');
  const liveApps = await LiveApp.find({ visible: true, status: { $in: ['live', 'beta'] } }).sort('order');
  const base = (settings.siteUrl || 'https://denisjovitusbuberwa.djb.co.tz').replace(/\/$/, '');
  const name = settings.fullName || 'Denis Jovitus Buberwa';
  const aka = (settings.akaNames || []).join(', ');

  const lines = [
    `# ${name}`,
    '',
    aka ? `Also known as: ${aka}.` : '',
    settings.tagline || '',
    '',
    settings.heroSubtitle || settings.seoDescription || '',
    '',
    `Based in: ${settings.location || 'Dar es Salaam, Tanzania'}`,
    `Portfolio: ${base}/`,
    `Contact: ${settings.email || ''}`,
    '',
    '## Live applications built and operated',
    ...liveApps.map((a) => `- ${a.name}: ${a.url}${a.description ? ' — ' + a.description : ''}`),
    '',
    '## Elsewhere online',
    ...socialLinks.map((s) => `- ${s.platform}: ${s.url}`)
  ];

  res.type('text/plain').send(lines.join('\n') + '\n');
});

export default router;
