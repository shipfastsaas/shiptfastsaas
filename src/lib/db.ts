import mongoose from 'mongoose'

// Augmenter le type global
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Global {
    mongoose: {
      conn: typeof mongoose | null
      promise: Promise<typeof mongoose> | null
    } | undefined
  }
}

const MONGODB_URI = process.env.MONGODB_URI || ''

// Initialiser la connexion globale
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  }
}

async function dbConnect() {
  if (global.mongoose?.conn) {
    return global.mongoose.conn
  }

  if (!global.mongoose?.promise) {
    const opts = {
      bufferCommands: false,
    }

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    global.mongoose.conn = await global.mongoose.promise
  } catch (e) {
    global.mongoose.promise = null
    throw e
  }

  return global.mongoose.conn
}

export default dbConnect
