import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';

function ZigzagTimeline({ items, icon: Icon, accent, renderBody }) {
  return (
    <div className="relative mx-auto mt-10 max-w-4xl">
      <div
        className={`absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b ${accent.line}`}
        aria-hidden="true"
      />
      {items.map((item, i) => (
        <motion.div
          key={item._id || i}
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className={`relative mb-8 pl-16 md:w-1/2 md:pl-0 text-left ${
            i % 2 ? 'md:ml-auto md:pl-12' : 'md:pr-12'
          }`}
        >
          <span
            className={`absolute top-3 grid place-items-center w-10 h-10 rounded-full border-4 border-bg ${accent.badge} shadow-glow left-0 md:left-auto ${
              i % 2 ? 'md:-left-5' : 'md:-right-5'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </span>
          <div className="glass-card p-5">{renderBody(item, i)}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Experience({ experience = [], education = [], settings }) {
  if (!experience.length && !education.length) return null;

  return (
    <section className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-16 text-center"
      >
        {settings?.experienceTitle || 'Experience & Education'}
      </motion.h2>

      {experience.length > 0 && (
        <div id="experience" className="scroll-mt-28 mb-20">
          <motion.h3
            initial={{ opacity: 1, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-brand-teal font-semibold uppercase tracking-wide text-sm text-center flex items-center justify-center gap-2"
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

          <ZigzagTimeline
            items={experience}
            icon={Briefcase}
            accent={{ line: 'from-brand-teal via-brand-violet to-brand-teal', badge: 'bg-brand-teal text-[#08122c]' }}
            renderBody={(job) => (
              <>
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
              </>
            )}
          />
        </div>
      )}

      {education.length > 0 && (
        <div id="education" className="scroll-mt-28">
          <motion.h3
            initial={{ opacity: 1, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-brand-violet dark:text-brand-cream font-semibold uppercase tracking-wide text-sm text-center flex items-center justify-center gap-2"
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

          <ZigzagTimeline
            items={education}
            icon={GraduationCap}
            accent={{
              line: 'from-brand-violet via-brand-teal to-brand-violet',
              badge: 'bg-brand-violet text-white'
            }}
            renderBody={(edu) => (
              <>
                <p className="text-fg font-semibold">{edu.degree}</p>
                <p className="text-brand-violet dark:text-brand-cream text-sm">{edu.school}</p>
                <p className="text-muted text-xs">
                  {edu.period} {edu.details && `· ${edu.details}`}
                </p>
              </>
            )}
          />
        </div>
      )}
    </section>
  );
}
