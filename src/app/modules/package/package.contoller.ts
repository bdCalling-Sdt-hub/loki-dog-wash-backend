import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PackageService } from './package.service';
import Stripe from 'stripe';
import stripe from '../../../config/stripe';
import ApiError from '../../../errors/ApiError';

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
      throw new ApiError(StatusCodes.BAD_REQUEST, `Webhook Error: ${err.message}`);
    }
  
    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        break;
      // Add other event handlers as needed
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