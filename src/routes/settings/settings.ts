import express from 'express';
import { Router } from 'express';
import * as settingController from '../../controllers/settings.controller';
import multerMiddleware from '../../middleware/multer.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(
    multerMiddleware.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'favIcon', maxCount: 1 }
    ]),
    settingController.create
  )
  .put(
    multerMiddleware.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'favIcon', maxCount: 1 }
    ]),
    settingController.update
  )
  .get(settingController.get);

export default router;
