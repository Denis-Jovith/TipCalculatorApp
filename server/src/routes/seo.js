import { Router } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';

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
    'achievements'
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
  res.type('text/plain').send(`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
});

export default router;
