const express = require('express');
const { body } = require('express-validator');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true }); // needed to access :postId from parent router

router.get('/', getComments);
router.post(
    '/',
    protect, [body('content').trim().notEmpty().withMessage('Comment cannot be empty')],
    validate,
    addComment
);

module.exports = router;