import express from 'express';
import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware';
import * as gptController from '../../controllers/gpt/gpt.controller';

const router: Router = express.Router();

router
  .route('/')
  .get(isAuthenticated, gptController.getChat)
  .post(isAuthenticated, gptController.sendMessage);

export default router;
