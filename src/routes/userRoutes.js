import express from 'express';

import { register, login, protect } from '../controllers/authController.js';
import {
  isOwner,
  doesUserExist,
  deleteUser,
  updateUser,
  subscribeToUser,
  unSubscribeFromUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router
  .route('/:id')
  .patch(protect, isOwner, updateUser)
  .delete(protect, isOwner, deleteUser);

router.put('/subscribe/:id', protect, doesUserExist, subscribeToUser);
router.put('/unsubscribe/:id', protect, doesUserExist, unSubscribeFromUser);

export default router;
