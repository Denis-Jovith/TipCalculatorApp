import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, RefreshCw } from 'lucide-react';

export default function LivePreviewModal({ project, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    const t = setTimeout(() => setSlow(true), 3500);
    return () => clearTimeout(t);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Live preview of ${project.title}`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-card w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border">
            <div className="flex items-center gap-2 min-w-0">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted truncate">{project.liveUrl}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-brand-teal hover:text-fg"
              >
                <ExternalLink size={14} aria-hidden="true" /> Open live
              </a>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="text-muted hover:text-fg"
                aria-label="Close live preview"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-white">
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg text-muted">
                <RefreshCw className="animate-spin text-brand-teal" aria-hidden="true" />
                <p className="text-sm">Loading live preview…</p>
                {slow && (
                  <p className="text-xs text-faint max-w-xs text-center">
                    Taking a while? Some sites block embedded previews.{' '}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-teal underline"
                    >
                      Open it directly instead
                    </a>
                    .
                  </p>
                )}
              </div>
            )}
            <iframe
              title={`Live preview of ${project.title}`}
              src={project.liveUrl}
              onLoad={() => setLoaded(true)}
              className="w-full h-full border-0"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
