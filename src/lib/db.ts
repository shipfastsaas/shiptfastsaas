import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

class Database {
  private static instance: Database
  private _conn: typeof mongoose | null = null
  private _promise: Promise<typeof mongoose> | null = null

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<typeof mongoose> {
    // Si déjà connecté, retourner la connexion existante
    if (this._conn) {
      return this._conn
    }

    // Si une connexion est en cours, attendre qu'elle se termine
    if (this._promise) {
      return await this._promise
    }

    try {
      // Créer une nouvelle connexion
      this._promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      })

      this._conn = await this._promise
      return this._conn
    } catch (e) {
      this._promise = null
      throw e
    }
  }
}

// Fonction simple pour les composants
async function dbConnect(): Promise<typeof mongoose> {
  const database = Database.getInstance()
  return database.connect()
}

export default dbConnect
