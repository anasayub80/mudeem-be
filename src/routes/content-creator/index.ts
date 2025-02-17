import express from 'express';
import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import * as contentCreatorController from '../../controllers/content-creator/content-creator.controller';
// import * as schema from '../../validations/content-creator.schema';
// import { validate } from '../../middleware/validate.middleware';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    isAuthenticated,
    multerMiddleware.single('file'),
    contentCreatorController.createContent
  )
  .get(contentCreatorController.getReel);

router.route('/get/my/reels').get(isAuthenticated, contentCreatorController.getReels);

router
  .route('/:id')
  .delete(isAuthenticated, contentCreatorController.deleteReel);

router
  .route('/:id/like-unlike')
  .put(isAuthenticated, contentCreatorController.likeUnlikeReel);

router
  .route('/:id/comment')
  .post(isAuthenticated, contentCreatorController.createComment);

router
  .route('/:id/comment/:commentId')
  .delete(isAuthenticated, contentCreatorController.deleteComment);

router
  .route('/:id/comment/:commentId/like-unlike')
  .put(isAuthenticated, contentCreatorController.likeUnlikeComment);

router
  .route('/:id/comment/:commentId/reply')
  .post(isAuthenticated, contentCreatorController.createReply);

export default router;
