import bcrypt from 'bcrypt';

import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  // If password is wanted to update, hash it
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const isOwner = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No document found with that ID'), 404);
  }
  if (user.id !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action'),
      403
    );
  }
  next();
});