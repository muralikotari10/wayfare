import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userAvatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    authorHandle: { type: String, default: '@wayfarer' },
    destination: { type: String, required: true },
    country: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    tripDuration: { type: String, default: '5 Days' },
    budgetSpent: { type: String, default: '$950' },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
      likedBy: [{ type: String }],
    savedBy: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;
