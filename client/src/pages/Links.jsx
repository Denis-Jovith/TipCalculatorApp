import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as Icons from 'lucide-react';
import { ArrowLeft, QrCode, Share2, Link2, Check, Download, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { TikTokIcon, ThreadsIcon } from '../components/BrandSocialIcons.jsx';
import StyledQR, { downloadStyledQr } from '../components/StyledQR.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime.js';

const CUSTOM_ICONS = { TikTok: TikTokIcon, Threads: ThreadsIcon };
function resolveIcon(name) {
  return CUSTOM_ICONS[name] || Icons[name] || Icons.Link;
}

// A single, share-friendly "link in bio" page - everything about Denis in one scannable
// destination. Deliberately skips the full Navbar/Footer so it loads fast and stays focused,
// matching the pattern of the atclsaccos.co.tz/connect-with-us page this was modelled on.
export default function Links() {
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCanvas, setQrCanvas] = useState(null);

  useEffect(() => {
    Promise.allSettled([api.get('/settings'), api.get('/social-links')]).then(([s, sl]) => {
      if (s.status === 'fulfilled') setSettings(s.value.data);
      if (sl.status === 'fulfilled') setSocialLinks(sl.value.data);
      setLoaded(true);
    });
  }, []);

  const ready = useMinLoadingTime(loaded);
  if (!ready) return <LoadingScreen />;

  const name = settings?.fullName || 'Denis Jovitus Buberwa';
  const tagline = settings?.tagline || 'Multipurpose ICT Professional & Full-Stack MERN Developer';
  const pageUrl = `${(settings?.siteUrl || 'https://denisjovitusbuberwa.djb.co.tz').replace(/\/$/, '')}/links`;
  const visibleLinks = socialLinks.filter((s) => s.visible !== false);

  const destinations = [
    { key: 'portfolio', label: 'View Full Portfolio', url: '/', icon: Globe, internal: true },
    ...(settings?.resumeUrl
      ? [{ key: 'resume', label: 'Download Resume / CV', url: settings.resumeUrl, icon: Download }]
      : []),
    ...visibleLinks.map((l) => ({ key: l._id || l.platform, label: l.platform, url: l.url, icon: resolveIcon(l.icon) }))
  ];

  const handleShare = async () => {
    const shareData = { title: name, text: `Connect with ${name}`, url: pageUrl };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled - no-op
      }
      return;
    }
    await navigator.clipboard.writeText(pageUrl);
    toast.success('Link copied — sharing isn\'t supported in this browser.');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Connect with {name}</title>
        <meta name="description" content={`Every way to reach ${name} in one place.`} />
      </Helmet>

      <div className="min-h-screen bg-brand-gradient-radial dark:bg-brand-gradient-radial-dark px-5 py-8 sm:py-12">
        <div className="max-w-md mx-auto">
          <RouterLink
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to portfolio
          </RouterLink>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-5">
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-full bg-gradient-to-br from-brand-teal/50 via-brand-violet/30 to-brand-teal/50 blur-lg"
              />
              <img
                src={settings?.heroImage || '/seed/profile.jpeg'}
                alt={name}
                className="relative w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-glow"
              />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">{name}</h1>
            <p className="mt-1.5 text-sm text-white/70 max-w-xs">{tagline}</p>
          </div>

          <div className="space-y-3">
            {destinations.map((d) => {
              const Icon = d.icon;
              const commonProps = {
                className:
                  'flex items-center justify-between gap-3 w-full px-5 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-colors backdrop-blur-sm'
              };
              const content = (
                <>
                  <span className="flex items-center gap-3">
                    <Icon size={18} aria-hidden="true" />
                    {d.label}
                  </span>
                  <Icons.ChevronRight size={16} className="opacity-60" aria-hidden="true" />
                </>
              );
              return d.internal ? (
                <RouterLink key={d.key} to={d.url} {...commonProps}>
                  {content}
                </RouterLink>
              ) : (
                <a key={d.key} href={d.url} target="_blank" rel="noopener noreferrer" {...commonProps}>
                  {content}
                </a>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <QrCode size={14} aria-hidden="true" /> {showQr ? 'Hide QR' : 'Show QR'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Share2 size={14} aria-hidden="true" /> Share
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>

          {showQr && (
            <div className="flex flex-col items-center gap-4 mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
              <StyledQR
                value={pageUrl}
                size={220}
                logoUrl="/logo/icon-192.png"
                onReady={setQrCanvas}
                className="rounded-xl"
              />
              <button
                type="button"
                onClick={() => downloadStyledQr(qrCanvas, 'djb-links-qr.png')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/90 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Download size={14} aria-hidden="true" /> Download PNG
              </button>
            </div>
          )}

          <p className="text-center text-xs text-white/40 mt-10">
            {new Date().getFullYear()} {name}
          </p>
        </div>
      </div>
    </>
  );
}
