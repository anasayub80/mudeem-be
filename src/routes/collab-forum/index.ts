import express from 'express';
import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import * as collabForumController from '../../controllers/collab-forum/collab-forum.controller';
import * as schema from '../../validations/collab-forum.schema';
import { validate } from '../../middleware/validate.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    isAuthenticated,
    validate(schema.createUpdatePost),
    collabForumController.createPost
  )
  .get(collabForumController.getAllPosts);

router
  .route('/:id')
  .get(collabForumController.getPost)
  .put(
    isAuthenticated,
    validate(schema.createUpdatePost),
    collabForumController.updatePost
  );

router
  .route('/:id/like-unlike')
  .put(isAuthenticated, collabForumController.likeUnlikePost);
router
  .route('/:id/comment')
  .post(
    isAuthenticated,
    validate(schema.createCommentReply),
    collabForumController.createComment
  );
router
  .route('/:id/comment/:commentId')
  .delete(isAuthenticated, collabForumController.deleteComment);
router
  .route('/:id/comment/:commentId/like-unlike')
  .put(isAuthenticated, collabForumController.likeUnlikeComment);
router
  .route('/:id/comment/:commentId/reply')
  .post(
    isAuthenticated,
    validate(schema.createCommentReply),
    collabForumController.createReply
  );

export default router;
