const Post = require('../models/Post');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const createPost = catchAsync(async(req, res, next) => {
    const { title, content, excerpt, coverImage, tags, status } = req.body;

    const post = await Post.create({
        title,
        content,
        excerpt,
        coverImage,
        tags,
        status,
        author: req.user._id,
    });

    res.status(201).json(post);
});

const getPosts = catchAsync(async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [posts, total] = await Promise.all([
        Post.find(filter)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
        Post.countDocuments(filter),
    ]);

    res.status(200).json({
        posts,
        page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
    });
});

const getPostBySlug = catchAsync(async(req, res, next) => {
    const post = await Post.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { returnDocument: 'after' }).populate('author', 'name avatar bio');

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    res.status(200).json(post);
});

const updatePost = catchAsync(async(req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to edit this post', 403));
    }

    const { title, content, excerpt, coverImage, tags, status } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) post.status = status;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
});

const deletePost = catchAsync(async(req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to delete this post', 403));
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
});


const getPostById = catchAsync(async(req, res, next) => {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar bio');

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    res.status(200).json(post);
});
module.exports = {
    createPost,
    getPosts,
    getPostBySlug,
    getPostById,
    updatePost,
    deletePost
};