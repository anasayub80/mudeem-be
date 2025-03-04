import express from 'express';
import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';
import * as careersController from '../../controllers/careers/job.controller';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .get(careersController.getAllJobs)
  .post(isAuthenticated, isAdmin, careersController.createJob);
router
  .route('/:id')
  .put(careersController.updateJob)
  .delete(careersController.deleteJob);

export default router;
