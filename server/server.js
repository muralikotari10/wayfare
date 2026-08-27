import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import postRoutes from './routes/postRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import googlePlacesRoutes from './routes/googlePlacesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();
// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database with auto fallback
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/google-places', googlePlacesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    databaseConnected: getDBStatus(),
    databaseMode: getDBStatus() ? 'MongoDB Live' : 'In-Memory Fast Store',
  });
});

// Root ping
app.get('/', (req, res) => {
  res.send('✈️ Wayfare API Server is up and soaring!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Wayfare Error]:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Wayfare Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch((error) => {
  console.error(`[Wayfare Startup Error]: ${error.message}`);
  process.exitCode = 1;
});
