import mongoose from 'mongoose';

// Real, currently-operated applications/platforms - distinct from Project (which is a
// portfolio case study with images/video/tags). This is a lean "still running, visit it"
// showcase: name, URL, one-line description, and a status badge.
const liveAppSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['live', 'beta', 'coming-soon'], default: 'live' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('LiveApp', liveAppSchema);
