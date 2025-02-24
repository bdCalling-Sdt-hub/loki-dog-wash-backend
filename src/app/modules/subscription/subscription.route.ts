import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

//router.post('/webhook', SubscriptionController.handleStripeWebhook);
router.route('/cancel/:id').post(SubscriptionController.cancelSubscription);
router.route('/user/:userId').get(SubscriptionController.getUserSubscriptions);
router.route('/checkout/:packageId').post(auth(USER_ROLES.USER), SubscriptionController.createCheckoutSession);

export const SubscriptionRoutes = router;