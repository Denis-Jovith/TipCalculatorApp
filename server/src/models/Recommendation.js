import mongoose from 'mongoose';

// Testimonials from people Denis has worked with — distinct from the generic achievement
// comments: structured (title, company, rating, thumbs up/down) and admin-moderated.
const recommendationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: '' }, // their job title
    company: { type: String, default: '' }, // their office/organization
    relationship: { type: String, default: '' }, // how/where they met Denis
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    recommend: { type: Boolean, default: true }, // thumbs up / thumbs down
    photo: { type: String, default: '' },
    // Private — optional, for Denis to reach back out. Never exposed on the public endpoint.
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    approved: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);
