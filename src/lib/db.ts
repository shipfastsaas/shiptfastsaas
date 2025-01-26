import mongoose from 'mongoose'

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

// Étendre l'objet global avec notre interface
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Global extends GlobalWithMongoose {}
}

const MONGODB_URI = process.env.MONGODB_URI || ''

let cached = (global as GlobalWithMongoose).mongoose

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
