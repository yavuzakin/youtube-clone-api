import express from 'express';

import { protect } from '../controllers/authController.js';
import {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
  doesCommentExist,
  isCommentOwner,
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllComments).post(protect, createComment);
router
  .route('/:id')
  .get(doesCommentExist, getComment)
  .patch(protect, doesCommentExist, isCommentOwner, updateComment)
  .delete(protect, doesCommentExist, isCommentOwner, deleteComment);

export default router;
