import mongoose from 'mongoose'

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an organization name'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  stripeCustomerId: String,
  subscriptionId: String,
  subscriptionStatus: String,
  trialEndsAt: Date,
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
  }],
}, {
  timestamps: true,
})

const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema)

export default Organization
