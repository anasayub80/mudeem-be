import express, { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as schema from '../../validations/banner.schema';
import * as bannerController from '../../controllers/shop/banner.controller';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .get(isAuthenticated, bannerController.getBanners)
  .post(
    isAuthenticated,
    isAdmin,
    multerMiddleware.single('image'),
    validate(schema.createBanner),
    bannerController.createBanner
  );
router
  .route('/:id')
  .put(
    isAuthenticated,
    isAdmin,
    multerMiddleware.single('image'),
    validate(schema.updateBanner),
    bannerController.updateBanner
  )
  .delete(isAuthenticated, isAdmin, bannerController.deletebanner);

export default router;
