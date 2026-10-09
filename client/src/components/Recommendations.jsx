import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import RecommendationCard from './RecommendationCard.jsx';
import RecommendationFormModal from './RecommendationFormModal.jsx';

export default function Recommendations({ recommendations = [], settings }) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="recommendations" className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-3 text-center"
      >
        {settings?.recommendationsTitle || 'Recommendations'}
      </motion.h2>
      <p className="text-center text-muted mb-8 max-w-xl mx-auto">
        {settings?.recommendationsSubtitle ||
          "What people I've worked with have to say. Worked with me? Leave one below."}
      </p>

      <div className="flex justify-center mb-10">
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-brand-olive text-brand-olive dark:text-brand-cream font-semibold hover:bg-brand-olive/20 transition"
        >
          <MessageSquarePlus size={18} aria-hidden="true" /> Leave a recommendation
        </button>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec._id} recommendation={rec} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-center text-faint text-sm">No recommendations yet — be the first to leave one.</p>
      )}

      <RecommendationFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}
