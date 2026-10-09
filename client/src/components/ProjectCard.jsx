import { motion } from 'framer-motion';
import { Github, Play, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onPreview, fixedWidth = true }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className={`group relative glass-card overflow-hidden flex flex-col ${
        fixedWidth ? 'shrink-0 w-[85vw] sm:w-[320px]' : 'w-full'
      }`}
    >
      <Link to={`/projects/${project.slug}`} className="block relative h-44 overflow-hidden bg-surface-2">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={`${project.title} preview`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-faint">No image</div>
        )}
        {project.featured && (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-brand-teal text-[#08122c] font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <Link to={`/projects/${project.slug}`}>
          <h4 className="text-fg font-semibold leading-snug hover:text-brand-teal transition-colors">
            {project.title}
          </h4>
        </Link>
        <p className="text-sm text-muted line-clamp-3 flex-1">{project.summary}</p>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-surface-2 text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 mt-auto border-t border-surface-border">
          {project.liveUrl && (
            <button
              onClick={() => onPreview(project)}
              className="flex items-center gap-1 text-xs font-medium text-brand-teal hover:text-fg transition-colors"
            >
              <Play size={14} aria-hidden="true" /> Live preview
            </button>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              className="flex items-center gap-1 text-xs font-medium text-muted hover:text-fg transition-colors"
            >
              <Github size={14} aria-hidden="true" /> Code
            </a>
          )}
          <Link
            to={`/projects/${project.slug}`}
            className="ml-auto flex items-center gap-1 text-xs font-medium text-muted hover:text-fg transition-colors"
          >
            Details <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
