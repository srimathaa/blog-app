const express = require('express');
const { body } = require('express-validator');
const { signup, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
    '/signup', [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    validate,
    signup
);

router.post(
    '/login', [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
);

router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;