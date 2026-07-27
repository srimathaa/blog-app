const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 120,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    excerpt: {
        type: String,
        maxlength: 200,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        default: [],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    views: {
        type: Number,
        default: 0,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Auto-generate slug before validation
postSchema.pre('validate', function() {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .concat('-', Date.now().toString().slice(-6));
    }
});

// Text search index
postSchema.index({
    title: 'text',
    content: 'text',
});

// Separate index for tags (optional but recommended)


module.exports = mongoose.model('Post', postSchema);