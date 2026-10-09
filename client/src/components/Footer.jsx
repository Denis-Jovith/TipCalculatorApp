import { Link } from 'react-router-dom';
import BrandMark from './BrandMark.jsx';
import SocialBar from './SocialBar.jsx';

const QUICK_LINKS = [
  { href: '#about', key: 'about', fallback: 'About' },
  { href: '#skills', key: 'skills', fallback: 'Skills' },
  { href: '#projects', key: 'projects', fallback: 'Projects' },
  { href: '#achievements', key: 'achievements', fallback: 'Achievements' },
  { href: '#connect', key: 'connect', fallback: 'Connect' }
];

export default function Footer({ settings, socialLinks = [] }) {
  const akaNames = settings?.akaNames || [];
  const symbol = settings?.footerCopyrightSymbol ?? '©';
  const showYear = settings?.footerShowYear ?? true;
  const name = settings?.fullName ?? 'Denis Jovitus Buberwa';
  const shortName = settings?.shortName || 'DJB';
  const tagline = settings?.footerTagline ?? 'Built with the MERN stack as a Progressive Web App.';
  const akaLabel = settings?.akaLabel ?? 'Also known as:';
  const nav = settings?.navLabels || {};

  const lead = [symbol, showYear ? String(new Date().getFullYear()) : '', name].filter(Boolean).join(' ');
  const line1 = [lead && `${lead}.`, tagline].filter(Boolean).join(' ');

  return (
    <footer className="relative border-t border-surface-border overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-teal/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-64 rounded-full bg-brand-teal/5 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <Link to="/#top" className="flex items-center gap-2.5 font-display text-lg font-bold gradient-text w-fit">
            <BrandMark size={30} className="rounded-lg shrink-0" />
            {shortName}<span className="text-brand-teal">.</span>
          </Link>

          {QUICK_LINKS.length > 0 && (
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {QUICK_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-brand-teal transition-colors">
                  {nav[l.key] || l.fallback}
                </a>
              ))}
            </nav>
          )}

          {socialLinks.length > 0 && <SocialBar socialLinks={socialLinks} variant="grid" />}
        </div>

        {(line1 || akaNames.length > 0) && (
          <div className="mt-10 pt-6 border-t border-surface-border text-center text-sm text-muted">
            {line1 && <p>{line1}</p>}
            {akaNames.length > 0 && (
              <p className="mt-1 text-xs text-faint">
                {akaLabel ? `${akaLabel} ` : ''}
                {akaNames.join(' · ')}
              </p>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
