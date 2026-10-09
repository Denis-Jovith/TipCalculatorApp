import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      enum: ['web', 'mobile', 'blender', 'other'],
      default: 'web'
    },
    summary: { type: String, default: '' },
    descriptionHtml: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    images: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    // Play only a highlight clip of the video without trimming the actual file.
    videoStartTime: { type: Number, default: 0 },
    videoEndTime: { type: Number, default: null },
    videoMuted: { type: Boolean, default: true },
    liveUrl: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

projectSchema.pre('validate', function generateSlug(next) {
  if (this.title && !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }
  next();
});

export default mongoose.model('Project', projectSchema);
