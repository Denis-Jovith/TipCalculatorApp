import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    // Public comments are held for review by default — reduces spam/abuse exposure on an
    // unauthenticated public endpoint. Approve or delete from the admin Comments screen.
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
