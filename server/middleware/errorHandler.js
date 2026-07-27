const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    let error = {...err, message: err.message };

    if (err.name === 'CastError') {
        error = new AppError('Resource not found', 404);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(`${field} already exists`, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new AppError(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
    });
};

module.exports = errorHandler;