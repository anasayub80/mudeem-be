import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import {
    verifySubscription,
    getUserSubscriptions,
    cancelSubscription,
    handleSubscriptionWebhook
} from '../controllers/subscription/subscription.controller';

const router = express.Router();

// Protected routes (require authentication)
router.post('/verify', isAuthenticated, verifySubscription);
router.get('/my-subscriptions', isAuthenticated, getUserSubscriptions);
router.post('/cancel/:subscriptionId', isAuthenticated, cancelSubscription);

// Webhook endpoint (no authentication required as it will be called by Google/Apple)
router.post('/webhook', handleSubscriptionWebhook);

export default router;