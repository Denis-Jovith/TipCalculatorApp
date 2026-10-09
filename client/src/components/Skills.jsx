import { motion } from 'framer-motion';

export default function Skills({ skills = [], settings }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  if (!skills.length) return null;

  return (
    <section id="skills" className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-12 text-center"
      >
        {settings?.skillsTitle || 'Skills & Expertise'}
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((category, ci) => (
          <motion.div
            key={category}
            initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: ci * 0.05 }}
            className="glass-card p-6"
          >
            <h3 className="text-brand-teal font-semibold uppercase tracking-wide text-sm mb-5">{category}</h3>
            <div className="space-y-4">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <div key={skill._id || skill.name}>
                    <div className="flex justify-between text-sm text-fg mb-1">
                      <span>{skill.name}</span>
                      <span className="text-muted">{skill.level}%</span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-surface-2 overflow-hidden"
                      role="progressbar"
                      aria-label={`${skill.name} proficiency`}
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-violet"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
