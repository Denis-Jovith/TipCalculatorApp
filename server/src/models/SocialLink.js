import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // e.g. GitHub, LinkedIn, Email, Instagram, X, WhatsApp, YouTube, Facebook, TikTok
    url: { type: String, required: true },
    icon: { type: String, default: '' }, // lucide-react icon name used on the client
    // 'button' = full-width labelled row (the /links page default); 'icon' = small circular
    // icon-only badge, shown in a compact row instead - for links that don't need a label.
    style: { type: String, enum: ['button', 'icon'], default: 'button' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('SocialLink', socialLinkSchema);
