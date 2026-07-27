const Comment = require('../models/Comment');
const Post = require('../models/Post');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const addComment = catchAsync(async(req, res, next) => {
    const { content } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    const comment = await Comment.create({
        content,
        post: postId,
        author: req.user._id,
    });

    await comment.populate('author', 'name avatar');

    res.status(201).json(comment);
});

const getComments = catchAsync(async(req, res, next) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 });

    res.status(200).json(comments);
});

const deleteComment = catchAsync(async(req, res, next) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return next(new AppError('Comment not found', 404));
    }

    if (comment.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to delete this comment', 403));
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
});

module.exports = { addComment, getComments, deleteComment };