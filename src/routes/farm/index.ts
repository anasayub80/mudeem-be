import express from 'express';
import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as farmController from '../../controllers/farm/farm.controller';
import * as farmBannerController from '../../controllers/farm/banner.controller';
import * as schema from '../../validations/farm.schema';
import multerMiddleware from '../../middleware/multer.middleware';
import { createBanner, updateBanner } from '../../validations/banner.schema';
const router: Router = express.Router();

router
  .route('/banner')
  .post(
    isAuthenticated,
    isAdmin,
    multerMiddleware.single('image'),
    validate(createBanner),
    farmBannerController.createBanner
  )
  .get(isAuthenticated, farmBannerController.getBanners);
router
  .route('/banner/:id')
  .put(
    isAuthenticated,
    isAdmin,
    multerMiddleware.single('image'),
    validate(updateBanner),
    farmBannerController.updateBanner
  )
  .delete(isAuthenticated, isAdmin, farmBannerController.deletebanner);

router
  .route('/')
  .post(
    isAuthenticated,
    // validate(schema.createFarm),
    multerMiddleware.array('images', 5),
    farmController.createFarm
  )
  .get(isAuthenticated, farmController.getFarms);

router
  .route('/:id')
  .get(isAuthenticated, farmController.getFarm)
  .patch(
    isAuthenticated,
    validate(schema.updateFarm),
    farmController.approveRejectFarm
  );

export default router;
