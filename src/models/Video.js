import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Video must belong to a user'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    imgUrl: {
      type: String,
      required: [true, 'Please provide an image url'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide a video url'],
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username profilePic subscribers',
  });
  next();
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
