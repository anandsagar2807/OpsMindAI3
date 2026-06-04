import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true,
    default: 'User'
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  orgId: {
    type: String,
    default: null,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.statics.findByClerkId = function (clerkId) {
  return this.findOne({ clerkId });
};

export default mongoose.model('User', userSchema);
