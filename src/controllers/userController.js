import bcrypt from 'bcrypt';

import User from '../models/User.js';
import Video from '../models/Video.js';
import Comment from '../models/Comment.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const userVideos = await Video.find({ user: userId });

  const userDeletePromise = User.findByIdAndDelete(userId);
  const userVideosDeletePromise = Video.deleteMany({ user: userId });
  const userCommentsDeletePromise = Comment.deleteMany({ user: userId });
  const userVideosCommentsDeletePromises = userVideos.map((userVideo) =>
    Comment.deleteMany({ video: userVideo._id })
  );

  await Promise.all([
    userDeletePromise,
    userVideosDeletePromise,
    userCommentsDeletePromise,
    ...userVideosCommentsDeletePromises,
  ]);

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

export const subscribeToUser = catchAsync(async (req, res) => {
  const queriedUserId = req.queriedUser.id;
  const loggedInUserId = req.user.id;

  const updatedQueriedUser = await User.findByIdAndUpdate(
    queriedUserId,
    { $addToSet: { subscribers: loggedInUserId } },
    { new: true }
  );
  const updatedLoggedInUser = await User.findByIdAndUpdate(
    loggedInUserId,
    { $addToSet: { subscribedUsers: queriedUserId } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedLoggedInUser,
      subscribedTo: updatedQueriedUser,
    },
  });
});

export const unSubscribeFromUser = catchAsync(async (req, res) => {
  const queriedUserId = req.queriedUser.id;
  const loggedInUserId = req.user.id;

  const updatedQueriedUser = await User.findByIdAndUpdate(
    queriedUserId,
    { $pull: { subscribers: loggedInUserId } },
    { new: true }
  );
  const updatedLoggedInUser = await User.findByIdAndUpdate(
    loggedInUserId,
    { $pull: { subscribedUsers: queriedUserId } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedLoggedInUser,
      unSubscribedFrom: updatedQueriedUser,
    },
  });
});

export const doesUserExist = catchAsync(async (req, res, next) => {
  const queriedUser = await User.findById(req.params.id);
  if (!queriedUser) {
    return next(new AppError('No document found with that ID', 404));
  }
  req.queriedUser = queriedUser;
  next();
});

export const isOwner = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }
  if (user.id !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
});
