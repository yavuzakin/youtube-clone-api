import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { promisify } from 'util';

import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signJWT(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    // token,
    data: {
      user,
    },
  });
};

export const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({ username, email, password: hashedPassword });

  const storedUser = await newUser.save();

  createAndSendToken(storedUser, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createAndSendToken(user, 200, req, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(async (req, res, next) => {
  // 1. Check if there is a token
  const token = req.cookies.jwt;
  if (!token) {
    next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2. If there is a token, check whether it's valid
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4. If it's valid put that user into request
  req.user = currentUser;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }
    next();
  };
};
