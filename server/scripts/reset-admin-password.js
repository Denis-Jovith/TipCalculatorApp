import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';

const email = (process.env.ADMIN_EMAIL || 'denisjovitusbuberwa@gmail.com').toLowerCase();
const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/reset-admin-password.js <new-password>');
  process.exit(1);
}

await connectDB();
const user = await User.findOne({ email });
if (!user) {
  console.error(`No user found with email ${email}`);
  process.exit(1);
}
user.password = password;
user.status = 'active';
user.emailVerified = true;
await user.save();
console.log(`Password reset for ${email}`);
process.exit(0);
