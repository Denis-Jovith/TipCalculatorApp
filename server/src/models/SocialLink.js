import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // e.g. GitHub, LinkedIn, Email, Instagram, X, WhatsApp, YouTube, Facebook, TikTok
    url: { type: String, required: true },
    icon: { type: String, default: '' }, // lucide-react icon name used on the client
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('SocialLink', socialLinkSchema);
