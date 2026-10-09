import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Comment from '../models/Comment.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many comments posted. Please try again later.' }
});

// Public: approved comments for one achievement.
router.get('/', async (req, res) => {
  if (req.query.achievementId) {
    const comments = await Comment.find({ achievement: req.query.achievementId, approved: true }).sort(
      '-createdAt'
    );
    return res.json(comments);
  }
  // No achievementId + no auth = not a valid public request.
  return res.status(400).json({ message: 'achievementId query parameter is required' });
});

router.post('/', commentLimiter, async (req, res) => {
  const { achievementId, name, message } = req.body;
  if (!achievementId || !name || !message) {
    return res.status(400).json({ message: 'achievementId, name and message are required' });
  }
  const comment = await Comment.create({ achievement: achievementId, name, message });
  res.status(201).json({ message: 'Thanks! Your comment will appear once approved.', id: comment._id });
});

// Admin moderation queue: every comment, newest first, with the achievement title attached.
router.get('/all', requireAuth, async (_req, res) => {
  const comments = await Comment.find().populate('achievement', 'title slug').sort('-createdAt');
  res.json(comments);
});

router.patch('/:id', requireAuth, async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!comment) return res.status(404).json({ message: 'Not found' });
  res.json(comment);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
