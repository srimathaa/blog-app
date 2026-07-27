const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signup = catchAsync(async(req, res, next) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new AppError('User already exists', 400));
    }

    const user = await User.create({ name, email, password });

    generateToken(res, user._id);

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
});

const login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Invalid email or password', 401));
    }

    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
});

const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = (req, res) => {
    res.status(200).json(req.user);
};

module.exports = { signup, login, logout, getMe };