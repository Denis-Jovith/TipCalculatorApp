import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Systems & Infrastructure',
        'Programming & Web',
        'Banking & Enterprise',
        'Networking',
        'Tools & Platforms',
        'Mobile & UI/UX',
        'Remote Support & Collaboration',
        'Cybersecurity & Emerging Tech'
      ],
      default: 'Programming & Web'
    },
    level: { type: Number, min: 0, max: 100, default: 80 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
