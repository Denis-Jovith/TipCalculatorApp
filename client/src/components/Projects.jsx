import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProjectCard from './ProjectCard.jsx';
import LivePreviewModal from './LivePreviewModal.jsx';
import VideoShowreel from './VideoShowreel.jsx';
import CarouselNav from './CarouselNav.jsx';
import { useAutoScrollRow } from '../hooks/useAutoScrollRow.js';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'blender', label: 'Blender / 3D' },
  { key: 'other', label: 'Other' }
];

export default function Projects({ projects = [], settings }) {
  const [tab, setTab] = useState('all');
  const [preview, setPreview] = useState(null);
  const { ref: rowRef, scrollStep } = useAutoScrollRow();

  const availableTabs = useMemo(
    () => TABS.filter((t) => t.key === 'all' || projects.some((p) => p.category === t.key)),
    [projects]
  );

  const filtered = tab === 'all' ? projects : projects.filter((p) => p.category === tab);
  const featuredVideo = projects.find((p) => p.category === 'blender' && p.videoUrl);

  if (!projects.length) return null;

  return (
    <section id="projects" className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-3 text-center"
      >
        {settings?.projectsTitle || 'Projects'}
      </motion.h2>
      <p className="text-center text-muted mb-10 max-w-xl mx-auto">
        {settings?.projectsSubtitle ||
          'A mix of web, mobile and 3D work. Click a live preview to scroll it right here, or open it in a new tab.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 relative">
        <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap justify-center gap-2">
          {availableTabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-brand-teal text-[#08122c]'
                  : 'bg-surface text-muted hover:bg-surface-2 border border-surface-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Link
          to="/projects"
          className="sm:absolute sm:right-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-muted border border-surface-border hover:bg-surface hover:text-fg transition-colors"
        >
          View all <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {tab === 'blender' && featuredVideo && (
        <div className="mb-10 max-w-2xl mx-auto">
          <VideoShowreel
            src={featuredVideo.videoUrl}
            poster={featuredVideo.thumbnail}
            startTime={featuredVideo.videoStartTime}
            endTime={featuredVideo.videoEndTime}
            defaultMuted={featuredVideo.videoMuted ?? true}
          />
        </div>
      )}

      <div className="relative">
        <div ref={rowRef} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
          {filtered.map((project) => (
            <div key={project._id || project.slug} className="snap-start">
              <ProjectCard project={project} onPreview={setPreview} />
            </div>
          ))}
        </div>
        {filtered.length > 1 && <CarouselNav scrollStep={scrollStep} />}
      </div>

      <LivePreviewModal project={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
