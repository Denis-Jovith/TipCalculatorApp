import { motion } from 'framer-motion';
import { ArrowDown, Download } from 'lucide-react';
import ImageCarousel from './ImageCarousel.jsx';

export default function Hero({ settings }) {
  const fullName = settings?.fullName || 'Denis Jovitus Buberwa';
  // Respects an intentionally-cleared list — no fallback to hardcoded names, so leaving
  // this blank in admin actually hides the line instead of showing placeholder names.
  const akaNames = settings?.akaNames ?? [];
  const akaLabel = settings?.heroAkaLabel ?? 'aka';
  const tagline = settings?.tagline || 'Multipurpose ICT Professional & Full-Stack MERN Developer';
  const subtitle = settings?.heroSubtitle || '';
  const heroImage = settings?.heroImage || '/seed/profile.jpeg';
  // Extra profile photos (if any) turn this into an auto-playing carousel; otherwise a single photo.
  const profileImages = settings?.heroImages?.length ? settings.heroImages : [heroImage];
  const resumeUrl = settings?.resumeUrl;

  // The marquee shows role/identity descriptors (not names) — aka names still appear as
  // real on-page text just below, and in the footer/meta tags/structured data, for SEO.
  const roles = settings?.roles?.length
    ? settings.roles
    : [
        'Software Developer',
        'ICT Systems Professional',
        'Cybersecurity Enthusiast',
        'Blockchain Explorer',
        'AI Agents Professional',
        'MERN Stack Engineer'
      ];

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-brand-gradient-radial dark:bg-brand-gradient-radial-dark pt-24 pb-16"
    >
      {/* animated blobs, echoing the original app's purple gradient + texture background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-teal/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-brand-violet/40 rounded-full blur-3xl animate-blob [animation-delay:4s]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-brand-cream/10 rounded-full blur-3xl animate-blob [animation-delay:8s]" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full px-5 sm:px-8 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="relative"
        >
          <div aria-hidden="true" className="absolute inset-0 rounded-full bg-brand-teal/40 blur-2xl animate-float" />
          <ImageCarousel
            images={profileImages}
            alt={`Portrait of ${fullName}`}
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-glow animate-float"
            imgClassName="object-cover rounded-full border-4 border-white/30"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight"
        >
          {fullName}
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-2xl hero-gradient-text font-semibold"
        >
          {tagline}
        </motion.p>

        {akaNames.length > 0 && (
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-xs uppercase tracking-[0.2em] text-slate-300/80"
          >
            {akaLabel ? `${akaLabel} ` : ''}
            {akaNames.join(' · ')}
          </motion.p>
        )}

        {subtitle && (
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-slate-200"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
        >
          <a
            href={settings?.heroCtaPrimaryLink || '#projects'}
            className="px-6 py-3 rounded-full bg-brand-teal text-[#08122c] font-semibold hover:brightness-110 transition shadow-glow"
          >
            {settings?.heroCtaPrimaryText || 'View My Work'}
          </a>
          <a
            href={settings?.heroCtaSecondaryLink || '#connect'}
            className="px-6 py-3 rounded-full border border-brand-olive text-brand-cream font-semibold hover:bg-brand-olive/20 transition"
          >
            {settings?.heroCtaSecondaryText || "Let's Connect"}
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition"
            >
              <Download size={18} /> {settings?.resumeButtonText || 'Resume'}
            </a>
          )}
        </motion.div>
      </div>

      {/* Rotating identity marquee — what he does, not who he is (name variants live above/footer/meta) */}
      <div
        aria-hidden="true"
        className="relative mt-16 no-scrollbar overflow-hidden border-y border-white/10 bg-white/5 py-3"
      >
        <div className="flex w-max animate-marquee-slow gap-10 text-sm uppercase tracking-[0.3em] text-slate-300">
          {[...roles, ...roles, ...roles].map((role, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              {role}
              <span className="text-brand-teal">&bull;</span>
            </span>
          ))}
        </div>
      </div>
      {/* Screen-reader-only, non-repeating equivalent of the decorative marquee above */}
      <p className="sr-only">{roles.join(', ')}</p>

      <a
        href="#about"
        className="relative mx-auto mt-8 text-slate-300 hover:text-white transition-colors motion-safe:animate-bounce"
        aria-label="Scroll to About section"
      >
        <ArrowDown />
      </a>
    </section>
  );
}
