import express from 'express';
import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import * as greenMapController from '../../controllers/green-map/green-map.controller';

const router: Router = express.Router();

router
  .route('/')
  .post(
    isAuthenticated,
    // validate(greenMapController.createGreenMap),
    greenMapController.createGreenMap
  )
  .get(greenMapController.getAllGreenMaps);

router
  .route('/:id')
  .get(greenMapController.getGreenMap)
  .put(
    isAuthenticated,
    // validate(greenMapController.updateGreenMap),
    greenMapController.updateGreenMap
  )
  .delete(isAuthenticated, greenMapController.deleteGreenMap);

router
  .route('/reward/:id')
  .put(isAuthenticated, greenMapController.rewardGreenMap);

export default router;
