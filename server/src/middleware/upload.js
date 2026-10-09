import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'application/pdf'
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${unique}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  }
});

// A separate, much more restricted instance for unauthenticated public uploads (currently:
// the optional photo on a recommendation submission) — images only, small size cap.
const publicImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const publicImageUpload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!publicImageTypes.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG or WebP images are allowed'));
    }
    cb(null, true);
  }
});
