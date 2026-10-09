import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { api } from '../api/client';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import LivePreviewModal from '../components/LivePreviewModal.jsx';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'blender', label: 'Blender / 3D' },
  { key: 'other', label: 'Other' }
];

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [tab, setTab] = useState('all');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data)).catch(() => {});
    api.get('/settings').then(({ data }) => setSettings(data)).catch(() => {});
    api.get('/social-links').then(({ data }) => setSocialLinks(data)).catch(() => {});
  }, []);

  const availableTabs = useMemo(
    () => TABS.filter((t) => t.key === 'all' || projects.some((p) => p.category === t.key)),
    [projects]
  );
  const filtered = tab === 'all' ? projects : projects.filter((p) => p.category === tab);

  return (
    <>
      <Helmet>
        <title>All Projects · {settings?.fullName || 'Denis Jovitus Buberwa'}</title>
        <meta name="description" content="Every project — web, mobile, 3D, and more." />
      </Helmet>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar settings={settings} hasHero={false} />
      <main id="main-content" className="pt-28 pb-20 px-5 sm:px-8 max-w-6xl mx-auto">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-muted hover:text-fg mb-8">
          <ArrowLeft size={16} aria-hidden="true" /> Back to home
        </Link>

        <h1 className="section-title mb-3 text-center">{settings?.projectsTitle || 'Projects'}</h1>
        <p className="text-center text-muted mb-10 max-w-xl mx-auto">
          {settings?.projectsSubtitle || 'Every project, all in one place — filter by category below.'}
        </p>

        <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap justify-center gap-2 mb-10">
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

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} onPreview={setPreview} fixedWidth={false} />
            ))}
          </div>
        ) : (
          <p className="text-center text-faint">Nothing in this category yet.</p>
        )}

        <LivePreviewModal project={preview} onClose={() => setPreview(null)} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </>
  );
}
