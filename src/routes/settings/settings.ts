import express from 'express';
import { Router } from 'express';
import * as settingController from '../../controllers/settings.controller';

const router: Router = express.Router();
 
router.route('/').post(settingController.create);

export default router;
