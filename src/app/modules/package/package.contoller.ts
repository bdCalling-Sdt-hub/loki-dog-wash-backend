import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PackageService } from './package.service';
import Stripe from 'stripe';
import stripe from '../../../config/stripe';
import ApiError from '../../../errors/ApiError';
import { Subscription } from '../subscription/subscription.model';
import { Package } from './package.model';
import { User } from '../user/user.model';

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.createPackage(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package created successfully',
    data: result,
  });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackages();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Packages retrieved successfully',
    data: result,
  });
});

const getSinglePackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getSinglePackage(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package retrieved successfully',
    data: result,
  });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.updatePackage(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package updated successfully',
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.deletePackage(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Package deleted successfully',
    data: result,
  });
});

// Webhook handler for Stripe events
const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Webhook Error: ${err.message}`
    );
  }

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const metadata = session.metadata || {};

      // Check if this is a subscription payment
      if (session.mode !== 'subscription') break;

      const subscriptionId = session.subscription as string;

      // Retrieve subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price'],
      });

      // Get user ID from client_reference_id or customer email
      let userId;
      /*if (session.client_reference_id) {
          // We stored user ID in client_reference_id
          userId = session.client_reference_id;
        } else if (session.customer_details?.email) {
          // If client_reference_id isn't available, look up user by email
          const user = await User.findOne({ email: session.customer_details.email });
          if (!user) {
            console.log('User not found for email:', session.customer_details.email);
            break;
          }*/
      const customerEmail =
        session.customer_email ||
        metadata.prefilled_email ||
        (session.customer_details
          ? session.customer_details.email
          : null);

      if (!customerEmail) {
        console.error('No customer email found in checkout session');
        return;
      }

      const user = await User.findOne({ email: customerEmail });
      if (!user) {
        console.log('User not found for email:', customerEmail);
        break;
      }
      userId = user._id.toString();

      // Get packageId from session metadata, URL parameters, or price ID
      let packageId;
      
        // Try to find the package by price ID
        const priceId = subscription.items.data[0].price.id;
        const planData = await Package.findOne({ priceId });
        if (!planData) {
          console.log('Package not found for price:', priceId);
          break;
        }
        packageId = planData._id.toString();
      

      // Get the package data
      const packageData = await Package.findById(packageId);
      if (!packageData) {
        console.log('Package not found:', packageId);
        break;
      }

      // Create subscription record
      await Subscription.create({
        userId,
        price_id: subscription.items.data[0].price.id,
        plan_type: packageData.paymentType,
        start_date: new Date(subscription.current_period_start * 1000),
        end_date: new Date(subscription.current_period_end * 1000),
        status: subscription.status,
        stripe_subscription_id: subscription.id,
        amount: packageData.price,
      });

      break;
    }
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Webhook handled successfully',
  });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
  handleStripeWebhook,
};
