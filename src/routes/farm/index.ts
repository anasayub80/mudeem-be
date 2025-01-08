import express from 'express';
import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as farmController from '../../controllers/farm/farm.controller';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    isAuthenticated,
    // isAdmin,
    // validate(farmController.createFarm),
    multerMiddleware.array('images', 5),
    farmController.createFarm
  )
  .get(farmController.getFarms);

router.route('/:id').get(farmController.getFarm).patch(
  isAuthenticated,
  // isAdmin,
  // validate(farmController.updateFarm),
  farmController.approveRejectFarm
);

export default router;
