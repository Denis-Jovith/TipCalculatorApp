// Rewrites the static <head> tags in the built client/dist/index.html per-request, so link
// crawlers that never execute JS (WhatsApp, Facebook, Twitter/X, Slack, LinkedIn, Discord...)
// see live, admin-editable content instead of whatever was baked in at build time.

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absolutize(url, base) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

function replaceMetaContent(html, tagRegex, newContent) {
  return html.replace(tagRegex, (tag) => tag.replace(/content="[^"]*"/, `content="${escapeHtml(newContent)}"`));
}

export function renderIndexHtml(template, { settings = {}, title, description, image, url, keywords } = {}) {
  const base = (settings.siteUrl || 'https://denisjovitusbuberwa.djb.co.tz').replace(/\/$/, '');
  const finalTitle = title || settings.seoTitle || settings.fullName || 'Denis Jovitus Buberwa';
  const finalDescription = description || settings.seoDescription || settings.tagline || '';
  const finalImage = absolutize(image || settings.shareImage || settings.heroImage, base);
  const finalUrl = url || `${base}/`;
  const finalKeywords = (keywords || settings.seoKeywords || []).join(', ');

  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(finalTitle)}</title>`);
  html = replaceMetaContent(html, /<meta\s+name="description"[^>]*>/, finalDescription);
  if (finalKeywords) html = replaceMetaContent(html, /<meta\s+name="keywords"[^>]*>/, finalKeywords);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${finalUrl}" />`);
  html = replaceMetaContent(html, /<meta property="og:title"[^>]*>/, finalTitle);
  html = replaceMetaContent(html, /<meta\s+property="og:description"[^>]*>/, finalDescription);
  if (finalImage) html = replaceMetaContent(html, /<meta property="og:image"[^>]*>/, finalImage);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${finalUrl}" />`);
  html = replaceMetaContent(html, /<meta name="twitter:title"[^>]*>/, finalTitle);
  html = replaceMetaContent(html, /<meta\s+name="twitter:description"[^>]*>/, finalDescription);
  if (finalImage) html = replaceMetaContent(html, /<meta name="twitter:image"[^>]*>/, finalImage);

  return html;
}
