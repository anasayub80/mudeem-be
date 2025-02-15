import express from 'express';
import { Router } from 'express';
import * as poolController from '../../controllers/pool/pool.controller';
import { isAuthenticated } from '../../middleware/auth.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(isAuthenticated, poolController.createPool)
  .get(poolController.getPools);

router
  .route('/:id')
  .get(poolController.getPoolById)
  .delete(isAuthenticated, poolController.deletePool)
  .put(isAuthenticated, poolController.updatePool);

router.route('/endRide/:id').put(isAuthenticated, poolController.endRide);

export default router;
