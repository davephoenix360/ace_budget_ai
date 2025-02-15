import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
    throw new Error('Undefined MONGODB_URI environment variable');
}

const uri: string = process.env.MONGODB_URI;

export default async function dbConnect() {
  try {
    const connection = await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}