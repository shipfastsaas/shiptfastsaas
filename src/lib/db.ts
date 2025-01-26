import mongoose from 'mongoose'

type GlobalMongoose = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

// Vérifier si nous sommes en production
const isProduction = process.env.NODE_ENV === 'production'

if (!MONGODB_URI) {
  if (isProduction) {
    throw new Error(
      'MONGODB_URI is not defined. Make sure you have set this environment variable in your Vercel project settings.'
    )
  } else {
    console.warn('MONGODB_URI is not defined in development environment. Using fallback connection.')
  }
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: GlobalMongoose
}

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = {
    conn: null,
    promise: null,
  }
}

async function dbConnect() {
  const cached = globalWithMongoose.mongoose

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    if (!MONGODB_URI) {
      throw new Error(
        'MongoDB connection failed: MONGODB_URI is not defined. Please check your environment variables.'
      )
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection error:', e)
    throw new Error(
      'Failed to connect to MongoDB. Please check your connection string and make sure your MongoDB instance is running.'
    )
  }

  return cached.conn
}

export default dbConnect
