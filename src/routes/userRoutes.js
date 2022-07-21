import express from 'express';

import {
  register,
  login,
  logout,
  protect,
} from '../controllers/authController.js';
import {
  isOwner,
  doesUserExist,
  deleteUser,
  updateUser,
  subscribeToUser,
  unSubscribeFromUser,
} from '../controllers/userController.js';
import videoRouter from './videoRoutes.js';
import commentRouter from './commentRoutes.js';

const router = express.Router();

router.use('/:userId/videos', videoRouter);
router.use('/:userId/comments', commentRouter);

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router
  .route('/:id')
  .patch(protect, isOwner, updateUser)
  .delete(protect, isOwner, deleteUser);

router.put('/subscribe/:id', protect, doesUserExist, subscribeToUser);
router.put('/unsubscribe/:id', protect, doesUserExist, unSubscribeFromUser);

export default router;
