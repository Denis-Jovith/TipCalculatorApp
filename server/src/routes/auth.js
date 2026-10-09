import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { generateToken, hashToken } from '../utils/tokens.js';
import { sendAdminInviteEmail, sendPasswordResetEmail } from '../utils/mailer.js';

const router = Router();

const MAX_USERS = 3;
const INVITE_TTL_MS = 48 * 60 * 60 * 1000; // 48h
const RESET_TTL_MS = 60 * 60 * 1000; // 1h

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again later.' }
});

// Shared by forgot-password and accept-invite/reset-password submission — these are the
// endpoints an unauthenticated caller can hit, so they're the ones worth throttling hard.
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' }
});

function isValidPassword(pw) {
  return typeof pw === 'string' && pw.length >= 8;
}

function publicUser(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    emailVerified: u.emailVerified,
    canResetPassword: u.canResetPassword,
    createdAt: u.createdAt
  };
}

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (user.status === 'disabled') {
    return res.status(403).json({ message: 'This account has been disabled.' });
  }
  if (user.status === 'pending' || !user.emailVerified) {
    return res.status(403).json({ message: 'Please finish accepting your invite (check your email) before signing in.' });
  }

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token, user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(publicUser(user));
});

router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed' });
});

// ---- Admin user management (max 3 accounts, every one invited by an existing admin) ----

router.get('/users', requireAuth, async (_req, res) => {
  const users = await User.find().sort('createdAt');
  res.json(users.map(publicUser));
});

router.post('/users', requireAuth, async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  const normalizedEmail = String(email).toLowerCase().trim();

  const total = await User.countDocuments();
  if (total >= MAX_USERS) {
    return res.status(403).json({ message: `Maximum of ${MAX_USERS} admin users reached.` });
  }
  if (await User.findOne({ email: normalizedEmail })) {
    return res.status(409).json({ message: 'A user with that email already exists.' });
  }

  const { raw, hash } = generateToken();
  const user = await User.create({
    name,
    email: normalizedEmail,
    status: 'pending',
    emailVerified: false,
    invitedBy: req.user.id,
    verifyTokenHash: hash,
    verifyTokenExpires: new Date(Date.now() + INVITE_TTL_MS)
  });

  const inviter = await User.findById(req.user.id);
  const acceptUrl = `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/admin/accept-invite?token=${raw}&email=${encodeURIComponent(normalizedEmail)}`;
  const emailed = await sendAdminInviteEmail({ to: normalizedEmail, name, inviterName: inviter?.name, acceptUrl });

  res.status(201).json({
    user: publicUser(user),
    emailed,
    // Only returned when SMTP isn't configured, so the invite is still usable in dev/sandbox
    // environments without email set up — never logged or stored anywhere else.
    acceptUrl: emailed ? undefined : acceptUrl
  });
});

router.post('/users/:id/resend-invite', requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  if (user.status !== 'pending') {
    return res.status(400).json({ message: 'This user has already accepted their invite.' });
  }

  const { raw, hash } = generateToken();
  user.verifyTokenHash = hash;
  user.verifyTokenExpires = new Date(Date.now() + INVITE_TTL_MS);
  await user.save();

  const inviter = await User.findById(req.user.id);
  const acceptUrl = `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/admin/accept-invite?token=${raw}&email=${encodeURIComponent(user.email)}`;
  const emailed = await sendAdminInviteEmail({ to: user.email, name: user.name, inviterName: inviter?.name, acceptUrl });

  res.json({ emailed, acceptUrl: emailed ? undefined : acceptUrl });
});

router.patch('/users/:id', requireAuth, async (req, res) => {
  const { canResetPassword, status, name } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });

  if (status === 'disabled' || status === 'active') {
    if (status === 'disabled') {
      const activeOthers = await User.countDocuments({ _id: { $ne: user._id }, status: 'active' });
      if (activeOthers === 0 && user.status === 'active') {
        return res.status(400).json({ message: 'Cannot disable the only active admin account.' });
      }
    }
    user.status = status;
  }
  if (typeof canResetPassword === 'boolean') user.canResetPassword = canResetPassword;
  if (name) user.name = name;
  await user.save();
  res.json(publicUser(user));
});

router.delete('/users/:id', requireAuth, async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You can't remove your own account." });
  }
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Not found' });

  if (user.status === 'active') {
    const activeOthers = await User.countDocuments({ _id: { $ne: user._id }, status: 'active' });
    if (activeOthers === 0) {
      return res.status(400).json({ message: 'Cannot remove the only active admin account.' });
    }
  }
  await user.deleteOne();
  res.json({ message: 'Removed' });
});

// ---- Invite acceptance & forgot/reset password (public, unauthenticated) ----

router.post('/accept-invite', sensitiveLimiter, async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !isValidPassword(password)) {
    return res.status(400).json({ message: 'Email, token and a password of at least 8 characters are required.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select(
    '+verifyTokenHash +verifyTokenExpires'
  );
  if (
    !user ||
    !user.verifyTokenHash ||
    user.verifyTokenHash !== hashToken(token) ||
    !user.verifyTokenExpires ||
    user.verifyTokenExpires < new Date()
  ) {
    return res.status(400).json({ message: 'This invite link is invalid or has expired.' });
  }

  user.password = password;
  user.emailVerified = true;
  user.status = 'active';
  user.verifyTokenHash = null;
  user.verifyTokenExpires = null;
  await user.save();

  res.json({ message: 'Your account is ready — you can now sign in.' });
});

router.post('/forgot-password', sensitiveLimiter, async (req, res) => {
  const { email } = req.body;
  const generic = { message: 'If that account exists and is eligible for a reset, an email has been sent.' };
  if (!email) return res.json(generic);

  const user = await User.findOne({ email: String(email).toLowerCase() });
  // Deliberately identical response whether or not the account exists / is eligible — avoids
  // leaking which emails have admin accounts.
  if (!user || user.status !== 'active' || !user.emailVerified || !user.canResetPassword) {
    return res.json(generic);
  }

  const { raw, hash } = generateToken();
  user.resetTokenHash = hash;
  user.resetTokenExpires = new Date(Date.now() + RESET_TTL_MS);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/admin/reset-password?token=${raw}&email=${encodeURIComponent(user.email)}`;
  await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

  res.json(generic);
});

router.post('/reset-password', sensitiveLimiter, async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !isValidPassword(password)) {
    return res.status(400).json({ message: 'Email, token and a password of at least 8 characters are required.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select(
    '+resetTokenHash +resetTokenExpires'
  );
  if (
    !user ||
    !user.resetTokenHash ||
    user.resetTokenHash !== hashToken(token) ||
    !user.resetTokenExpires ||
    user.resetTokenExpires < new Date()
  ) {
    return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
  }
  if (!user.canResetPassword) {
    return res.status(403).json({ message: 'Password reset is not enabled for this account.' });
  }

  user.password = password;
  user.resetTokenHash = null;
  user.resetTokenExpires = null;
  await user.save();

  res.json({ message: 'Password reset — you can now sign in.' });
});

export default router;
