import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Every account here is admin-invited — there is no public self-registration, so "forgot
// password" is inherently limited to accounts Denis has already created. canResetPassword
// is an extra, explicit per-user switch on top of that for finer control.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // unset until an invited user accepts + sets one
    role: { type: String, enum: ['admin'], default: 'admin' },
    status: { type: String, enum: ['pending', 'active', 'disabled'], default: 'pending' },
    emailVerified: { type: Boolean, default: false },
    canResetPassword: { type: Boolean, default: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Single-use, time-limited tokens for the invite-accept and forgot-password flows. Only
    // a SHA-256 hash of the token is ever stored — the raw token exists only in the emailed
    // link, so a database read alone can never be used to hijack an account.
    verifyTokenHash: { type: String, select: false, default: null },
    verifyTokenExpires: { type: Date, select: false, default: null },
    resetTokenHash: { type: String, select: false, default: null },
    resetTokenExpires: { type: Date, select: false, default: null }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
