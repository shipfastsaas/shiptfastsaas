import mongoose from 'mongoose'

type GlobalMongoose = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var _mongoose: GlobalMongoose | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || ''

// Initialiser la connexion globale
if (!global._mongoose) {
  global._mongoose = {
    conn: null,
    promise: null,
  }
}

async function dbConnect() {
  if (global._mongoose?.conn) {
    return global._mongoose.conn
  }

  if (!global._mongoose?.promise) {
    const opts = {
      bufferCommands: false,
    }

    global._mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    global._mongoose.conn = await global._mongoose.promise
  } catch (e) {
    global._mongoose.promise = null
    throw e
  }

  return global._mongoose.conn
}

export default dbConnect
