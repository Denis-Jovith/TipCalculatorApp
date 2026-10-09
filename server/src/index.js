import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seed.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => seedDatabase({ verbose: true }))
  .then(() => {
    const app = createApp();
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
