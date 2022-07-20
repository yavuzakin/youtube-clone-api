import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide your username'],
      unique: true,
      minlength: 4,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: 8,
    },
    profilePic: {
      type: String,
      default: 'url.noimage',
    },
    subscribers: {
      type: [String],
      default: [],
    },
    subscribedUsers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
