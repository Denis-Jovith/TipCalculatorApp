import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import VideoShowreel from '../components/VideoShowreel.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get('/projects')
      .then(({ data }) => {
        const match = data.find((p) => p.slug === slug);
        if (match) setProject(match);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
    api.get('/settings').then(({ data }) => setSettings(data)).catch(() => {});
    api.get('/social-links').then(({ data }) => setSocialLinks(data)).catch(() => {});
  }, [slug]);

  const ready = useMinLoadingTime(!!project || notFound);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-fg">
        <p>Project not found.</p>
        <Link to="/" className="text-brand-teal underline">
          Back home
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>{project.title} - Denis Jovitus Buberwa</title>
        <meta name="description" content={project.summary} />
      </Helmet>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar settings={settings} hasHero={false} />
      <main id="main-content" className="pt-28 pb-20 px-5 sm:px-8 max-w-4xl mx-auto">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-muted hover:text-fg mb-8">
          <ArrowLeft size={16} aria-hidden="true" /> Back to projects
        </Link>

        {project.videoUrl ? (
          <VideoShowreel
            src={project.videoUrl}
            poster={project.thumbnail}
            startTime={project.videoStartTime}
            endTime={project.videoEndTime}
            defaultMuted={project.videoMuted ?? true}
          />
        ) : (
          project.thumbnail && (
            <img
              src={project.thumbnail}
              alt={`${project.title} preview`}
              className="w-full rounded-2xl shadow-glow mb-8"
            />
          )
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-fg mt-8 mb-3">{project.title}</h1>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-surface-2 text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-8">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-teal text-[#08122c] font-semibold hover:brightness-110"
            >
              <ExternalLink size={16} aria-hidden="true" /> View live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-border text-fg font-semibold hover:bg-surface"
            >
              <Github size={16} aria-hidden="true" /> View code
            </a>
          )}
        </div>

        <div className="prose-portfolio" dangerouslySetInnerHTML={{ __html: project.descriptionHtml }} />

        {project.images?.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {project.images.map((img) => (
              <img key={img} src={img} alt={`${project.title} screenshot`} className="rounded-xl w-full object-cover" />
            ))}
          </div>
        )}
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </>
  );
}
