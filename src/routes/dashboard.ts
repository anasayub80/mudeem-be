import express from 'express';
import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';

const router: Router = express.Router();

router.route('/').get(dashboardController.getAnalytics);

export default router;
