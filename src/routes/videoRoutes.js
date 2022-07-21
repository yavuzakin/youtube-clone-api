import express from 'express';

import { protect } from '../controllers/authController.js';
import {
  createVideo,
  getAllVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  doesVideoExist,
  isVideoOwner,
  likeVideo,
  dislikeVideo,
} from '../controllers/videoController.js';
import commentRouter from './commentRoutes.js';

const router = express.Router({ mergeParams: true });

router.use('/:videoId/comments', commentRouter);

router.route('/').post(protect, createVideo).get(getAllVideos);
router
  .route('/:id')
  .get(doesVideoExist, getVideo)
  .patch(protect, updateVideo)
  .delete(protect, doesVideoExist, isVideoOwner, deleteVideo);

router.put('/like/:id', protect, doesVideoExist, likeVideo);
router.put('/dislike/:id', protect, doesVideoExist, dislikeVideo);

export default router;
