import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AchievementCard from './AchievementCard.jsx';
import CarouselNav from './CarouselNav.jsx';
import { useAutoScrollRow } from '../hooks/useAutoScrollRow.js';

export default function Achievements({ achievements = [], settings }) {
  const { ref: rowRef, scrollStep } = useAutoScrollRow();

  if (!achievements.length) return null;

  return (
    <section id="achievements" className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-3 text-center"
      >
        {settings?.achievementsTitle || 'Achievements & Milestones'}
      </motion.h2>
      <p className="text-center text-muted mb-6 max-w-xl mx-auto">
        {settings?.achievementsSubtitle ||
          'Certifications, awards, and memorable moments along the way - click one to see more, download it, or leave a comment.'}
      </p>

      <div className="flex justify-center mb-6">
        <Link
          to="/achievements"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-muted border border-surface-border hover:bg-surface hover:text-fg transition-colors"
        >
          View all <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="relative">
        <div ref={rowRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="snap-start">
              <AchievementCard achievement={achievement} />
            </div>
          ))}
        </div>
        {achievements.length > 1 && <CarouselNav scrollStep={scrollStep} />}
      </div>
    </section>
  );
}
