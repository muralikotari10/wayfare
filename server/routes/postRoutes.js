import express from 'express';
import Post from '../models/Post.js';
import { getDBStatus } from '../config/db.js';
import { seedPosts } from '../seeds/seedData.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
let memoryPosts = JSON.parse(JSON.stringify(seedPosts));

// @route   GET /api/posts
router.get('/', async (req, res) => {
  try {
    if (getDBStatus()) {
      const posts = await Post.find().sort({ createdAt: -1 });
      if (posts.length > 0) return res.json(posts);
    }
    res.json(memoryPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, destination, country, images, tags, tripDuration, budgetSpent } = req.body;
    if (!title || !content || !destination) {
      return res.status(400).json({ message: 'Title, content, and destination are required' });
    }

    if (getDBStatus()) {
      const post = await Post.create({
        authorName: req.user?.name || 'Alex Nomad',
        authorAvatar: req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        authorHandle: `@${(req.user?.name || 'wayfarer').toLowerCase().replace(/\s+/g, '')}`,
        destination,
        country: country || destination,
        title,
        content,
        images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'],
        tags: tags || ['Travel', 'Explore'],
        tripDuration: tripDuration || '5 Days',
        budgetSpent: budgetSpent || '$800',
        likes: 0,
          likedBy: [],
          likedBy: [],
        comments: [],
      });
      return res.status(201).json(post);
    }

    const newPost = {
      _id: `post-${Date.now()}`,
      authorName: req.user?.name || 'Alex Nomad',
      authorAvatar: req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorHandle: `@${(req.user?.name || 'wayfarer').toLowerCase().replace(/\s+/g, '')}`,
      destination,
      country: country || destination,
      title,
      content,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'],
      tags: tags || ['Travel', 'Explore'],
      tripDuration: tripDuration || '5 Days',
      budgetSpent: budgetSpent || '$800',
      likes: 0,
      savedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    memoryPosts.unshift(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/posts/:id/like
router.patch('/:id/like', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      const userId = String(req.user.id);
      post.likedBy = post.likedBy || [];
      if (post.likedBy?.includes(userId)) return res.status(409).json({ message: 'You already liked this story', post });
      post.likedBy.push(userId);
      post.likes = post.likedBy.length;
      await post.save();
      return res.json(post);
    }
    const post = memoryPosts.find((p) => p._id === id);
    if (post) {
      const userId = String(req.user.id);
      post.likedBy = post.likedBy || [];
      if (post.likedBy.includes(userId)) return res.status(409).json({ message: 'You already liked this story', post });
      post.likedBy.push(userId);
      post.likes = post.likedBy.length;
      return res.json(post);
    }
    res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content required' });

    const post = memoryPosts.find((p) => p._id === id);
    if (post) {
      const comment = {
        _id: `comm-${Date.now()}`,
        userName: req.user?.name || 'Alex Nomad',
        userAvatar: req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        content,
        createdAt: new Date().toISOString(),
      };
      post.comments.push(comment);
      return res.json(post);
    }
    res.status(404).json({ message: 'Post not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
