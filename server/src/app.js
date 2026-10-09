import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import educationRoutes from './routes/education.js';
import socialRoutes from './routes/social.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import messageRoutes from './routes/messages.js';
import achievementRoutes from './routes/achievements.js';
import commentRoutes from './routes/comments.js';
import recommendationRoutes from './routes/recommendations.js';
import seoRoutes from './routes/seo.js';
import liveAppRoutes from './routes/liveApps.js';

export function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));
  app.use('/uploads', express.static(path.resolve('uploads')));

  // SEO endpoints live at the domain root so search engines find them at /sitemap.xml.
  app.use('/', seoRoutes);

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/experience', experienceRoutes);
  app.use('/api/education', educationRoutes);
  app.use('/api/social-links', socialRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/live-apps', liveAppRoutes);

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use((req, res) => {
    res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  });

  return app;
}
