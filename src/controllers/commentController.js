import Comment from '../models/Comment.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createComment = catchAsync(async (req, res) => {
  const { video, description } = req.body;

  const newComment = new Comment({
    user: req.user._id,
    video,
    description,
  });

  const storedComment = await newComment.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment: storedComment,
    },
  });
});

export const getAllComments = catchAsync(async (req, res) => {
  const videoId = req.params.videoId;
  let filter = {};

  if (videoId) {
    filter = { video: videoId };
  }
  const comments = await Comment.find(filter);

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

export const getComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

export const updateComment = catchAsync(async (req, res) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      comment: updatedComment,
    },
  });
});

export const deleteComment = catchAsync(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const doesCommentExist = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(new AppError('No document found with that ID', 404));
  }

  req.comment = comment;
  next();
});

export const isCommentOwner = catchAsync(async (req, res, next) => {
  if (req.comment.user.id !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
});
