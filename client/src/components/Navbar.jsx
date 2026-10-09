import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import BrandMark from './BrandMark.jsx';
import GlobalSearch from './GlobalSearch.jsx';

export default function Navbar({ settings, hasHero = true }) {
  // Pages without a dark Hero band (project/achievement detail & listing pages) have nothing
  // for a transparent+white nav to sit on — they start solid opaque instead of waiting for scroll.
  const [scrolled, setScrolled] = useState(!hasHero);
  const [open, setOpen] = useState(false);

  const shortName = settings?.shortName || 'DJB';
  const nav = settings?.navLabels || {};
  const LINKS = [
    { href: '#about', label: nav.about || 'About' },
    { href: '#skills', label: nav.skills || 'Skills' },
    { href: '#experience', label: nav.experience || 'Experience' },
    { href: '#education', label: nav.education || 'Education' },
    { href: '#projects', label: nav.projects || 'Projects' },
    { href: '#achievements', label: nav.achievements || 'Achievements' },
    { href: '#recommendations', label: nav.recommendations || 'Recommendations' },
    { href: '#connect', label: nav.connect || 'Connect' }
  ];

  useEffect(() => {
    if (!hasHero) return undefined;
    // Switches once the user has scrolled roughly past the Hero band (which is always a
    // dark fixed backdrop in both themes) into the page body — not just a few pixels in —
    // so the nav is never a half-opaque bar sitting on top of the vivid hero gradient.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasHero]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? 'bg-bg border-b border-surface-border shadow-glow' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        <a
          href="#top"
          className={`flex items-center gap-2 font-display text-xl font-bold tracking-wide ${
            scrolled ? 'gradient-text' : 'hero-gradient-text'
          }`}
        >
          <BrandMark size={32} className="rounded-lg shadow-glow shrink-0" />
          {shortName}<span className="text-brand-teal">.</span>
        </a>

        <ul
          className={`hidden md:flex items-center gap-8 text-sm font-medium ${
            scrolled ? 'text-fg' : 'text-white'
          }`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-brand-teal transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <GlobalSearch forceLight={!scrolled} />
          <ThemeToggle forceLight={!scrolled} />
          <button
            className={`md:hidden ${scrolled ? 'text-fg' : 'text-white'}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          id="mobile-nav-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden flex flex-col gap-1 px-5 pb-4 bg-bg border-b border-surface-border"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-fg hover:text-brand-teal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
