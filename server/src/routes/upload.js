import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

export default router;
