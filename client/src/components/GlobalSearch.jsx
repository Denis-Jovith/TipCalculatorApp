import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FolderKanban, Trophy, Sparkles, Briefcase, Star } from 'lucide-react';
import { api } from '../api/client';

const TYPE_META = {
  project: { label: 'Project', icon: FolderKanban },
  achievement: { label: 'Achievement', icon: Trophy },
  skill: { label: 'Skill', icon: Sparkles },
  experience: { label: 'Experience', icon: Briefcase },
  recommendation: { label: 'Recommendation', icon: Star }
};

export default function GlobalSearch({ forceLight = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const loadIndex = async () => {
    if (index || loading) return;
    setLoading(true);
    try {
      const [projects, achievements, skills, experience, recommendations] = await Promise.all([
        api.get('/projects').then((r) => r.data),
        api.get('/achievements').then((r) => r.data),
        api.get('/skills').then((r) => r.data),
        api.get('/experience').then((r) => r.data),
        api.get('/recommendations').then((r) => r.data)
      ]);

      const entries = [
        ...projects.map((p) => ({
          type: 'project',
          title: p.title,
          detail: p.summary,
          to: `/projects/${p.slug}`,
          text: `${p.title} ${p.summary || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
        })),
        ...achievements.map((a) => ({
          type: 'achievement',
          title: a.title,
          detail: a.summary,
          to: `/achievements/${a.slug}`,
          text: `${a.title} ${a.summary || ''}`.toLowerCase()
        })),
        ...skills.map((s) => ({
          type: 'skill',
          title: s.name,
          detail: s.category,
          to: '/#skills',
          text: `${s.name} ${s.category || ''}`.toLowerCase()
        })),
        ...experience.map((e) => ({
          type: 'experience',
          title: e.role,
          detail: e.organization,
          to: '/#experience',
          text: `${e.role} ${e.organization || ''}`.toLowerCase()
        })),
        ...recommendations.map((r) => ({
          type: 'recommendation',
          title: r.name,
          detail: r.message,
          to: '/#recommendations',
          text: `${r.name} ${r.title || ''} ${r.company || ''} ${r.message || ''}`.toLowerCase()
        }))
      ];
      setIndex(entries);
    } catch {
      setIndex([]);
    } finally {
      setLoading(false);
    }
  };

  const openSearch = () => {
    setOpen(true);
    loadIndex();
  };

  const closeSearch = () => {
    setOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const results = useMemo(() => {
    if (!index || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    return index.filter((entry) => entry.text.includes(q)).slice(0, 20);
  }, [index, query]);

  const go = (to) => {
    closeSearch();
    navigate(to);
  };

  return (
    <>
      <button
        onClick={openSearch}
        aria-label="Search the site"
        title="Search"
        className={`relative w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
          forceLight
            ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
            : 'border-surface-border bg-surface text-fg hover:bg-surface-2'
        }`}
      >
        <Search size={18} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 sm:pt-32 px-4"
            onClick={closeSearch}
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-card w-full max-w-xl max-h-[70vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border">
                <Search size={18} className="text-muted shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, achievements, skills…"
                  aria-label="Search query"
                  className="flex-1 bg-transparent text-fg placeholder:text-faint focus:outline-none text-sm"
                />
                <button onClick={closeSearch} aria-label="Close search" className="text-muted hover:text-fg shrink-0">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto">
                {loading && <p className="px-4 py-6 text-center text-sm text-muted">Loading…</p>}
                {!loading && query.trim().length >= 2 && results.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-muted">No matches for &ldquo;{query}&rdquo;.</p>
                )}
                {!loading && query.trim().length < 2 && (
                  <p className="px-4 py-6 text-center text-sm text-faint">Type at least 2 characters to search.</p>
                )}
                {results.map((r, i) => {
                  const meta = TYPE_META[r.type];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={`${r.type}-${i}`}
                      onClick={() => go(r.to)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface transition-colors border-b border-surface-border last:border-0"
                    >
                      <Icon size={16} className="text-brand-teal mt-0.5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-fg truncate">{r.title}</span>
                        {r.detail && <span className="block text-xs text-muted truncate">{r.detail}</span>}
                        <span className="block text-[10px] uppercase tracking-wide text-faint mt-0.5">{meta.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
