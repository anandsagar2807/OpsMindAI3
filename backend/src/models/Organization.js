import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    clerkOrgId: {
        type: String,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    maxDocuments: {
        type: Number,
        default: 10
    },
    maxChunks: {
        type: Number,
        default: 1000
    },
    ownerClerkId: {
        type: String,
        required: true
    },
    members: [{
        clerkId: String,
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Organization', organizationSchema);