import express from 'express';
import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';

const router: Router = express.Router();

router.route('/').get(leaderboardController.getLeaderboard);
router.route('/:id').get(leaderboardController.getLeaderboardById);

export default router;
