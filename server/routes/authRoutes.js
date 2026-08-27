import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/authMiddleware.js';
import { getDBStatus } from '../config/db.js';
import { demoUser } from '../seeds/seedData.js';

const router = express.Router();

// In-memory user store for demo / offline mode
let memoryUsers = [
  {
    ...demoUser,
    passwordHash: bcrypt.hashSync('wayfare123', 10),
  },
];

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: name.trim(),
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        passportStats: user.passportStats,
        token: generateToken(user._id),
      });
    } else {
      const existing = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email,
        passwordHash: bcrypt.hashSync(password, 10),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Passionate globetrotter & Wayfarer explorer.',
        homeCountry: 'United States',
        currency: 'USD',
        travelStyle: ['Adventure', 'Photography'],
        passportStats: {
          countriesVisited: 1,
          tripsCompleted: 1,
          totalMiles: 1200,
          badges: ['New Explorer'],
        },
        savedDestinations: [],
      };

      memoryUsers.push(newUser);
      return res.status(201).json({
        ...newUser,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          passportStats: user.passportStats,
          savedDestinations: user.savedDestinations,
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && bcrypt.compareSync(password, user.passwordHash)) {
        return res.json({
          ...user,
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/demo (1-click guest login)
router.post('/demo', (req, res) => {
  res.json({
    ...demoUser,
    token: generateToken(demoUser._id),
  });
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    if (getDBStatus()) {
      const user = await User.findById(req.user.id).select('-password');
      if (user) return res.json(user);
    }
    const memUser = memoryUsers.find((u) => u._id === req.user.id) || demoUser;
    res.json(memUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar, currency, homeCountry } = req.body;
    if (getDBStatus()) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.name = name || user.name;
        user.bio = bio !== undefined ? bio : user.bio;
        user.avatar = avatar || user.avatar;
        user.currency = currency || user.currency;
        user.homeCountry = homeCountry || user.homeCountry;
        const updated = await user.save();
        return res.json(updated);
      }
    }

    const idx = memoryUsers.findIndex((u) => u._id === req.user.id);
    if (idx !== -1) {
      memoryUsers[idx] = {
        ...memoryUsers[idx],
        ...(name?.trim() ? { name: name.trim() } : {}),
        ...(bio !== undefined ? { bio: String(bio).slice(0, 500) } : {}),
        ...(avatar ? { avatar: String(avatar) } : {}),
        ...(currency ? { currency: String(currency).toUpperCase() } : {}),
        ...(homeCountry ? { homeCountry: String(homeCountry).slice(0, 100) } : {}),
      };
      return res.json(memoryUsers[idx]);
    }
    res.json({ ...demoUser, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
