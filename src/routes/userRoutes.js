import express from 'express';

import { register, login, protect } from '../controllers/authController.js';
import {
  isOwner,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router
  .route('/:id')
  .patch(protect, isOwner, updateUser)
  .delete(protect, isOwner, deleteUser);

export default router;
