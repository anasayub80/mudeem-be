import express from 'express';
import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as greenMapController from '../../controllers/green-map/green-map.controller';
import * as schema from '../../validations/green-map.schema';

const router: Router = express.Router();

router
  .route('/')
  .post(
    // isAuthenticated,
    // isAdmin,
    validate(schema.createGreenMapPoint),
    greenMapController.createGreenMap
  )
  .get(greenMapController.getAllGreenMaps);

router
  .route('/:id')
  .get(greenMapController.getGreenMap)
  .put(
    isAuthenticated,
    isAdmin,
    validate(schema.createGreenMapPoint),
    greenMapController.updateGreenMap
  )
  .delete(isAuthenticated, isAdmin, greenMapController.deleteGreenMap);

router
  .route('/reward/:id')
  .put(isAuthenticated, greenMapController.rewardGreenMap);

export default router;
