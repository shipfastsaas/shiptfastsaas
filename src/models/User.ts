import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 'user' | 'admin' | 'super_admin'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
})

// Hash le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Méthode pour vérifier si l'utilisateur est admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin' || this.role === 'super_admin'
}

// Méthode pour vérifier si l'utilisateur est super admin
userSchema.methods.isSuperAdmin = function() {
  return this.role === 'super_admin'
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
