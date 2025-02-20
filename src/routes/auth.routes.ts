import express, { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import * as schema from '../validations/auth.schema';

const router: Router = express.Router();

// GET routes
router.route('/logout').get(auth.logout);
router.route('/me').get(isAuthenticated, auth.me);

// POST routes
router.route('/register-user').post(validate(schema.register), auth.register);
router.route('/login').post(validate(schema.login), auth.login);
router.route('/find-users').get(isAuthenticated, auth.findUsers);
router
  .route('/requestEmailToken')
  .post(validate(schema.requestEmailToken), auth.requestEmailToken);
router
  .route('/verifyEmail')
  .post(validate(schema.verifyEmailToken), auth.verifyEmail);
router
  .route('/forgotPassword')
  .post(validate(schema.requestEmailToken), auth.forgotPassword);

// PUT routes
router
  .route('/resetPassword')
  .put(validate(schema.resetPassword), auth.resetPassword);
router
  .route('/updatePassword')
  .put(isAuthenticated, validate(schema.updatePassword), auth.updatePassword);

router.route('/updateProfile').put(isAuthenticated, auth.updateProfile);

router
  .route('/changeSubscription')
  .put(isAuthenticated, isAdmin, auth.changeSubscriptionStatus);

// DELETE routes
router
  .route('/removeSessions')
  .delete(
    isAuthenticated,
    validate(schema.removeSessions),
    auth.removeSessions
  );

export default router;
