import Video from '../models/Video.js';
import Comment from '../models/Comment.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createVideo = catchAsync(async (req, res) => {
  const { title, description, imgUrl, videoUrl, tags } = req.body;

  const newVideo = new Video({
    user: req.user._id,
    title,
    description,
    imgUrl,
    videoUrl,
    tags,
  });

  const storedVideo = await newVideo.save();

  res.status(201).json({
    status: 'success',
    data: {
      video: storedVideo,
    },
  });
});

export const getAllVideos = catchAsync(async (req, res) => {
  const tags = req.query.tags;
  const userId = req.params.userId;
  let filter = {};

  if (userId) {
    filter = { user: userId };
  }

  if (tags) {
    const requestedTags = tags.split(',');
    filter = { tags: { $in: requestedTags } };
  }

  const videos = await Video.find(filter);

  res.status(200).json({
    status: 'success',
    results: videos.length,
    data: {
      videos,
    },
  });
});

export const getVideo = catchAsync(async (req, res) => {
  const video = await Video.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      video,
    },
  });
});

export const updateVideo = catchAsync(async (req, res) => {});

export const deleteVideo = catchAsync(async (req, res) => {
  const videoDeletePromise = Video.findByIdAndDelete(req.params.id);
  const videoCommentsDeletePromise = Comment.deleteMany({
    video: req.params.id,
  });

  await Promise.all([videoDeletePromise, videoCommentsDeletePromise]);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const likeVideo = catchAsync(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      video: updatedVideo,
    },
  });
});

export const dislikeVideo = catchAsync(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      video: updatedVideo,
    },
  });
});

export const doesVideoExist = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('No document found with that ID', 404));
  }
  req.video = video;
  next();
});

export const isVideoOwner = catchAsync(async (req, res, next) => {
  if (req.video.user.id !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
});
