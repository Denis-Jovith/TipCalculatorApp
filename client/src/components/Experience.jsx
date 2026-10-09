import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';

export default function Experience({ experience = [], education = [], settings }) {
  if (!experience.length && !education.length) return null;

  return (
    <section className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-12 text-center"
      >
        {settings?.experienceTitle || 'Experience & Education'}
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Employment — arrives with a teal glow pulse so clicking "Experience" in the nav feels distinct */}
        <motion.div
          id="experience"
          className="scroll-mt-28 rounded-2xl"
          initial={{ boxShadow: '0 0 0px rgba(79,168,168,0)' }}
          whileInView={{
            boxShadow: [
              '0 0 0px rgba(79,168,168,0)',
              '0 0 45px rgba(79,168,168,0.55)',
              '0 0 0px rgba(79,168,168,0)'
            ]
          }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        >
          <motion.h3
            initial={{ opacity: 1, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-brand-teal font-semibold uppercase tracking-wide text-sm mb-6 flex items-center gap-2"
          >
            <motion.span
              initial={{ rotate: -20, scale: 0.6, opacity: 1 }}
              whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <Briefcase size={16} />
            </motion.span>
            {settings?.employmentLabel || 'Employment'}
          </motion.h3>
          <ol className="relative border-l border-surface-border space-y-8 pl-6">
            {experience.map((job, i) => (
              <motion.li
                key={job._id || i}
                initial={{ opacity: 1, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-brand-teal shadow-glow" />
                <p className="text-fg font-semibold">{job.role}</p>
                <p className="text-brand-violet dark:text-brand-cream text-sm">
                  {job.organization} {job.location && `· ${job.location}`}
                </p>
                <p className="text-muted text-xs mb-2">
                  {job.startDate} — {job.endDate}
                </p>
                {job.bullets?.length > 0 && (
                  <ul className="list-disc list-inside text-muted text-sm space-y-1">
                    {job.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Education — arrives with a violet glow pulse + a graduation cap that spins in */}
        <motion.div
          id="education"
          className="scroll-mt-28 rounded-2xl"
          initial={{ boxShadow: '0 0 0px rgba(107,63,245,0)' }}
          whileInView={{
            boxShadow: [
              '0 0 0px rgba(107,63,245,0)',
              '0 0 45px rgba(107,63,245,0.55)',
              '0 0 0px rgba(107,63,245,0)'
            ]
          }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        >
          <motion.h3
            initial={{ opacity: 1, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-brand-violet dark:text-brand-cream font-semibold uppercase tracking-wide text-sm mb-6 flex items-center gap-2"
          >
            <motion.span
              initial={{ rotate: 180, scale: 0.4, opacity: 1 }}
              whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, type: 'spring' }}
            >
              <GraduationCap size={16} />
            </motion.span>
            {settings?.educationLabel || 'Education'}
          </motion.h3>
          <ol className="relative border-l border-surface-border space-y-8 pl-6">
            {education.map((edu, i) => (
              <motion.li
                key={edu._id || i}
                initial={{ opacity: 1, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-brand-violet shadow-glow" />
                <p className="text-fg font-semibold">{edu.degree}</p>
                <p className="text-brand-violet dark:text-brand-cream text-sm">{edu.school}</p>
                <p className="text-muted text-xs">
                  {edu.period} {edu.details && `· ${edu.details}`}
                </p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
