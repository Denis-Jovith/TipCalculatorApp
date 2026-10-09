import { Router } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getSingleton() {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}

router.get('/', async (_req, res) => {
  res.json(await getSingleton());
});

router.put('/', requireAuth, async (req, res) => {
  const settings = await getSingleton();
  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});

export default router;
