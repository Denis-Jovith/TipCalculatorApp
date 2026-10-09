import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    school: { type: String, required: true },
    period: { type: String, default: '' },
    details: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Education', educationSchema);
