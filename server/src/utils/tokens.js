import crypto from 'node:crypto';

// Raw token goes out in the emailed link only; the hash is what's persisted, so a database
// leak alone can never be replayed as a valid invite/reset link.
export function generateToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
