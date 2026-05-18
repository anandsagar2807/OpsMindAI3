import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Clerk authentication
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
  // Password is optional — Clerk handles auth for Clerk users
  password: {
    type: String,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'user'],
    default: 'employee'
  },
  permissions: {
    type: [String],
    default: []
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

// Hash password before save (only if password is modified and present)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method: check if user has a specific permission
userSchema.methods.hasPermission = function (permission) {
  if (this.role === 'admin') return true; // Admins have all permissions
  return this.permissions.includes(permission);
};

// Instance method: update last login timestamp
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return this.save();
};

// Static method: find user by Clerk ID
userSchema.statics.findByClerkId = function (clerkId) {
  return this.findOne({ clerkId });
};

// Static method: get default permissions for a role
userSchema.statics.getDefaultPermissions = function (role) {
  const permissionsMap = {
    admin: [
      'read:documents',
      'write:documents',
      'delete:documents',
      'read:chats',
      'write:chats',
      'delete:chats',
      'manage:users',
      'manage:settings',
      'view:analytics'
    ],
    employee: [
      'read:documents',
      'write:documents',
      'read:chats',
      'write:chats'
    ],
    user: [
      'read:documents',
      'read:chats'
    ]
  };
  return permissionsMap[role] || permissionsMap.user;
};

export default mongoose.model('User', userSchema);
