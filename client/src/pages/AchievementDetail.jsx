import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Download, CalendarDays } from 'lucide-react';
import { api } from '../api/client';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import ShareButton from '../components/ShareButton.jsx';
import CommentSection from '../components/CommentSection.jsx';
import ImageCarousel from '../components/ImageCarousel.jsx';
import VideoShowreel from '../components/VideoShowreel.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime.js';

export default function AchievementDetail() {
  const { slug } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get('/achievements')
      .then(({ data }) => {
        const match = data.find((a) => a.slug === slug);
        if (match) setAchievement(match);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
    api.get('/settings').then(({ data }) => setSettings(data)).catch(() => {});
    api.get('/social-links').then(({ data }) => setSocialLinks(data)).catch(() => {});
  }, [slug]);

  const ready = useMinLoadingTime(!!achievement || notFound);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-fg">
        <p>Achievement not found.</p>
        <Link to="/" className="text-brand-teal underline">
          Back home
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <LoadingScreen />;
  }

  const downloadUrl = achievement.documentUrl || achievement.videoUrl || achievement.images?.[0];
  const pageUrl = `${settings?.siteUrl || ''}/achievements/${achievement.slug}`;

  return (
    <>
      <Helmet>
        <title>{achievement.title} - Denis Jovitus Buberwa</title>
        <meta name="description" content={achievement.summary} />
      </Helmet>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar settings={settings} hasHero={false} />
      <main id="main-content" className="pt-28 pb-20 px-5 sm:px-8 max-w-4xl mx-auto">
        <Link to="/#achievements" className="inline-flex items-center gap-2 text-muted hover:text-fg mb-8">
          <ArrowLeft size={16} aria-hidden="true" /> Back to achievements
        </Link>

        {achievement.images?.length > 0 && (
          <ImageCarousel
            images={achievement.images}
            alt={achievement.title}
            className="w-full h-80 sm:h-96 rounded-2xl shadow-glow mb-8"
            imgClassName="object-cover rounded-2xl"
          />
        )}

        {achievement.videoUrl && (
          <div className="mb-8">
            <VideoShowreel
              src={achievement.videoUrl}
              startTime={achievement.videoStartTime}
              endTime={achievement.videoEndTime}
              defaultMuted={achievement.videoMuted ?? true}
              autoPlay={false}
              loopClip={false}
              showControls
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-fg mt-4 mb-2">{achievement.title}</h1>
        {achievement.date && (
          <p className="flex items-center gap-1.5 text-sm text-faint mb-6">
            <CalendarDays size={14} aria-hidden="true" /> {achievement.date}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          <ShareButton title={achievement.title} text={achievement.summary} url={pageUrl} />
          {achievement.downloadable && downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] text-sm font-semibold hover:brightness-110 transition-colors"
            >
              <Download size={16} aria-hidden="true" /> {achievement.documentLabel || 'Download'}
            </a>
          )}
        </div>

        <div className="prose-portfolio" dangerouslySetInnerHTML={{ __html: achievement.descriptionHtml }} />

        {achievement.commentable && <CommentSection achievementId={achievement._id} />}
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
    </>
  );
}
