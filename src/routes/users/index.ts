import express from 'express';
import { Router } from 'express';
import * as userController from '../../controllers/user/user.controller';
import { isAuthenticated } from '../../middleware/auth.middleware';

const router: Router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/:id').patch(userController.changeUserStatus);

export default router;
