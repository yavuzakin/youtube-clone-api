import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },
    video: {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
      required: [true, 'Comment must belong to a user'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
  },
  { timestamps: true }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username profilePic',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
