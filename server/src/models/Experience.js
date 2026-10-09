import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    organization: { type: String, required: true },
    location: { type: String, default: '' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    bullets: { type: [String], default: [] },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
