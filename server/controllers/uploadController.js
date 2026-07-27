const cloudinary = require('../config/cloudinary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  const b64 = req.file.buffer.toString('base64');
  const dataUri = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'blogapp',
  });

  res.status(200).json({ url: result.secure_url });
});

module.exports = { uploadImage };