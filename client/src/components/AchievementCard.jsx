import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, GraduationCap, Milestone, CalendarDays, Sparkles } from 'lucide-react';
import ImageCarousel from './ImageCarousel.jsx';

const CATEGORY_ICON = {
  certification: GraduationCap,
  award: Award,
  milestone: Milestone,
  event: Sparkles,
  other: Milestone
};

export default function AchievementCard({ achievement, fixedWidth = true }) {
  const Icon = CATEGORY_ICON[achievement.category] || Milestone;
  const thumb = achievement.images?.[0];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className={`glass-card overflow-hidden flex flex-col h-full ${
        fixedWidth ? 'shrink-0 w-[85vw] sm:w-[320px]' : 'w-full'
      }`}
    >
      <Link to={`/achievements/${achievement.slug}`} className="block relative h-44 overflow-hidden bg-surface-2">
        {achievement.images?.length > 0 ? (
          <ImageCarousel
            images={achievement.images}
            alt={achievement.title}
            className="w-full h-full"
            imgClassName="object-cover"
          />
        ) : thumb ? (
          <img src={thumb} alt={achievement.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint">
            <Icon size={32} aria-hidden="true" />
          </div>
        )}
        <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] uppercase tracking-wider bg-brand-violet text-white font-bold px-2 py-1 rounded-full">
          <Icon size={12} aria-hidden="true" /> {achievement.category}
        </span>
      </Link>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <Link to={`/achievements/${achievement.slug}`}>
          <h4 className="text-fg font-semibold leading-snug hover:text-brand-teal transition-colors">
            {achievement.title}
          </h4>
        </Link>
        {achievement.date && (
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <CalendarDays size={12} aria-hidden="true" /> {achievement.date}
          </p>
        )}
        <p className="text-sm text-muted line-clamp-3 flex-1">{achievement.summary}</p>
        <Link
          to={`/achievements/${achievement.slug}`}
          className="text-xs font-medium text-brand-teal hover:text-fg transition-colors mt-2"
        >
          View details →
        </Link>
      </div>
    </motion.article>
  );
}
