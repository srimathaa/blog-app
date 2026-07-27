const express = require('express');
const { body } = require('express-validator');
const {
    createPost,
    getPosts,
    getPostBySlug,
    getPostById,
    updatePost,
    deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const commentRoutes = require('./commentRoutes');
const router = express.Router();

const postValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
];

router.get('/', getPosts);
router.get('/id/:id', getPostById);
router.get('/:slug', getPostBySlug);
router.post('/', protect, postValidation, validate, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.use('/:postId/comments', commentRoutes);

module.exports = router;