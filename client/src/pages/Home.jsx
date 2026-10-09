import { Helmet } from 'react-helmet-async';
import { usePublicData } from '../hooks/usePublicData.js';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';
import Experience from '../components/Experience.jsx';
import Projects from '../components/Projects.jsx';
import Achievements from '../components/Achievements.jsx';
import Recommendations from '../components/Recommendations.jsx';
import ContactSection from '../components/ContactSection.jsx';
import Footer from '../components/Footer.jsx';
import InstallPrompt from '../components/InstallPrompt.jsx';
import ScrollProgress from '../components/ScrollProgress.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import { useMinLoadingTime } from '../hooks/useMinLoadingTime.js';

export default function Home() {
  const {
    settings,
    skills,
    experience,
    education,
    projects,
    achievements,
    recommendations,
    socialLinks,
    loading
  } = usePublicData();

  const ready = useMinLoadingTime(!loading || !!settings);
  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>{settings?.seoTitle}</title>
        <meta name="description" content={settings?.seoDescription} />
        {settings?.seoKeywords?.length > 0 && <meta name="keywords" content={settings.seoKeywords.join(', ')} />}
      </Helmet>

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollProgress />
      <Navbar settings={settings} />
      <main id="main-content" className="overflow-x-hidden">
        <Hero settings={settings} />
        <About settings={settings} />
        <Skills skills={skills} settings={settings} />
        <Experience experience={experience} education={education} settings={settings} />
        <Projects projects={projects} settings={settings} />
        <Achievements achievements={achievements} settings={settings} />
        <Recommendations recommendations={recommendations} settings={settings} />
        <ContactSection socialLinks={socialLinks} settings={settings} />
      </main>
      <Footer settings={settings} socialLinks={socialLinks} />
      <InstallPrompt />
    </>
  );
}
