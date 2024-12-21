import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global variable to keep track of connection across hot reloads
 * This is to avoid multiple connections in development.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  console.log("connected to mongo db");

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
