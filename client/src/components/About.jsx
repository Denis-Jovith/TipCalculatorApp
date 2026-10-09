import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function About({ settings }) {
  return (
    <section id="about" className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-10 text-center"
      >
        {settings?.aboutTitle || 'About Me'}
      </motion.h2>

      <motion.div
        initial={{ opacity: 1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6 sm:p-10 grid sm:grid-cols-[1fr_auto] gap-8 items-start"
      >
        <div
          className="prose-portfolio text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: settings?.aboutHtml || '' }}
        />

        <div className="flex sm:flex-col gap-4 flex-wrap sm:min-w-[220px] sm:border-l sm:border-surface-border sm:pl-8">
          {settings?.location && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} className="text-brand-teal shrink-0" /> {settings.location}
            </div>
          )}
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-sm text-muted hover:text-brand-teal"
            >
              <Mail size={16} className="text-brand-teal shrink-0" /> {settings.email}
            </a>
          )}
          {settings?.phone && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Phone size={16} className="text-brand-teal shrink-0" /> {settings.phone}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
