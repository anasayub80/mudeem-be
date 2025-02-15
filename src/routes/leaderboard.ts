import express from 'express';
import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';

const router: Router = express.Router();

router.route('/').get(leaderboardController.getLeaderboard);

export default router;
