import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Recommendation from '../models/Recommendation.js';
import { requireAuth } from '../middleware/auth.js';
import { publicImageUpload } from '../middleware/upload.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many recommendations submitted. Please try again later.' }
});

const photoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many photo uploads. Please try again later.' }
});

// Public, unauthenticated, tightly rate-limited — the only way a non-admin can upload a
// file. Images only, 4MB cap (enforced in the multer config), used solely for the optional
// photo on a recommendation submission.
router.post('/photo', photoLimiter, publicImageUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

function isAuthenticated(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return false;
  try {
    jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Public: approved recommendations only. Contact details are private — never sent here.
router.get('/', async (_req, res) => {
  const items = await Recommendation.find({ approved: true })
    .select('-contactEmail -contactPhone')
    .sort('order -createdAt');
  res.json(items);
});

// Public submission (pending review) — auto-approved when posted from the authenticated
// admin dashboard, so Denis can add recommendations directly without a two-step process.
router.post('/', submitLimiter, async (req, res) => {
  const { name, title, company, relationship, message, rating, recommend, photo, contactEmail, contactPhone } =
    req.body;
  if (!name || !message) {
    return res.status(400).json({ message: 'Name and message are required' });
  }
  const approved = isAuthenticated(req);
  const rec = await Recommendation.create({
    name,
    title,
    company,
    relationship,
    message,
    rating,
    recommend,
    photo,
    contactEmail,
    contactPhone,
    approved
  });
  res.status(201).json({
    message: approved ? 'Recommendation added.' : 'Thanks! Your recommendation will appear once approved.',
    id: rec._id,
    approved
  });
});

router.get('/all', requireAuth, async (_req, res) => {
  const items = await Recommendation.find().sort('-createdAt');
  res.json(items);
});

router.put('/:id', requireAuth, async (req, res) => {
  const rec = await Recommendation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!rec) return res.status(404).json({ message: 'Not found' });
  res.json(rec);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const rec = await Recommendation.findByIdAndDelete(req.params.id);
  if (!rec) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
