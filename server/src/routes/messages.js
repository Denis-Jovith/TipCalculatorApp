import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import { sendContactNotification } from '../utils/mailer.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages sent. Please try again later.' }
});

router.post('/', contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  const saved = await Message.create({ name, email, subject, message });
  try {
    await sendContactNotification({ name, email, subject, message });
  } catch (err) {
    console.error('Failed to send contact email notification:', err.message);
  }

  res.status(201).json({ message: 'Thanks for reaching out! I will get back to you soon.', id: saved._id });
});

router.get('/', requireAuth, async (_req, res) => {
  const messages = await Message.find().sort('-createdAt');
  res.json(messages);
});

router.patch('/:id', requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!msg) return res.status(404).json({ message: 'Not found' });
  res.json(msg);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
