import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env'), override: false });
dotenv.config({ path: path.resolve(process.cwd(), '..', 'db.env'), override: false });

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MongoDB Connection Error: MONGODB_URI is not set.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('MongoDB Atlas Connected Successfully!');
    return true;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export const getDBStatus = () => isConnected;
