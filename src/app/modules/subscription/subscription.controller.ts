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
    // Important: The raw body is needed for signature verification
    // Make sure your Express app is configured to preserve the raw body
    // for Stripe webhook endpoints
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new ApiError(StatusCodes.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  try {
    // Handle subscription-related events
    await SubscriptionService.handleSubscriptionWebhook(event);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Webhook handled successfully',
    });
  } catch (error: any) {
    console.error(`Error processing webhook: ${error.message}`);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: `Error processing webhook: ${error.message}`,
    });
  }
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