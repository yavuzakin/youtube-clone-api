import Video from '../models/Video.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createVideo = catchAsync(async (req, res) => {
  const { title, description, imgUrl, videoUrl } = req.body;

  const newVideo = new Video({
    user: req.user._id,
    title,
    description,
    imgUrl,
    videoUrl,
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
  const videos = await Video.find();

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
  await Video.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const doesVideoExist = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(new AppError('No document found with that ID'), 404);
  }
  req.video = video;
  next();
});

export const isVideoOwner = catchAsync(async (req, res, next) => {
  if (req.video.user.id !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action'),
      403
    );
  }
  next();
});
