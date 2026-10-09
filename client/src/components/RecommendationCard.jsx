import { motion } from 'framer-motion';
import { Quote, ThumbsUp, ThumbsDown } from 'lucide-react';
import StarRating from './StarRating.jsx';

export default function RecommendationCard({ recommendation, index = 0 }) {
  const { name, title, company, relationship, message, rating, recommend, photo } = recommendation;
  const roleLine = [title, company].filter(Boolean).join(' at ');

  return (
    <motion.article
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="glass-card p-6 flex flex-col gap-3 h-full"
    >
      <div className="flex items-start justify-between gap-3">
        <Quote className="text-brand-teal/60 shrink-0" size={28} aria-hidden="true" />
        {recommend ? (
          <span className="flex items-center gap-1 text-xs font-medium text-brand-teal">
            <ThumbsUp size={14} aria-hidden="true" /> Recommends
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-faint">
            <ThumbsDown size={14} aria-hidden="true" /> Mixed feedback
          </span>
        )}
      </div>

      <p className="text-muted text-sm leading-relaxed flex-1">&ldquo;{message}&rdquo;</p>

      <StarRating value={rating} />

      <div className="flex items-center gap-3 pt-3 border-t border-surface-border">
        {photo ? (
          <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-fg font-semibold text-sm">
            {name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-fg font-semibold text-sm truncate">{name}</p>
          {roleLine && <p className="text-faint text-xs truncate">{roleLine}</p>}
          {relationship && <p className="text-faint text-xs truncate">{relationship}</p>}
        </div>
      </div>
    </motion.article>
  );
}
