import express from 'express';
import { Router } from 'express';
import * as poolController from '../../controllers/pool/pool.controller';
import { isAdmin, isAuthenticated } from '../../middleware/auth.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(isAuthenticated, poolController.createPool)
  .get(poolController.getPools);

router.route('/get-my-pool').get(isAuthenticated, poolController.myPool);
router
  .route('/:id')
  .get(poolController.getPoolById)
  .delete(isAuthenticated, poolController.deletePool)
  .put(isAuthenticated, poolController.updatePool);

router.route('/end-ride/:id').put(isAuthenticated, poolController.endRide);
router.route('/start-ride/:id').put(isAuthenticated, poolController.startRide);
router
  .route('/get-all')
  .get(isAuthenticated, isAdmin, poolController.getAllPools);

export default router;
