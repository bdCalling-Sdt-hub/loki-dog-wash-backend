import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriptionService } from './subscription.service';
import stripe from '../../../config/stripe';
import ApiError from '../../../errors/ApiError';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { packageId } = req.params;
  const userId = req.user.id;

  const checkoutUrl = await SubscriptionService.createCheckoutSession(packageId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Checkout session created successfully',
    data: { checkoutUrl },
  });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  // Handle subscription-related events
  await SubscriptionService.handleSubscriptionWebhook(event);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Webhook handled successfully',
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.cancelSubscription(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subscription cancelled successfully',
    data: result,
  });
});

const getUserSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getUserSubscriptions(req.params.userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subscriptions retrieved successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createCheckoutSession,
  handleStripeWebhook,
  cancelSubscription,
  getUserSubscriptions,
};