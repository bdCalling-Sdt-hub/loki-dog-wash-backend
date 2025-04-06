import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPackage } from './package.interface';
import stripe from '../../../config/stripe';
import { Package } from './package.model';

const createPackage = async (payload: IPackage) => {
  // First create product in Stripe
  const product = await stripe.products.create({
    name: payload.title,
    description: payload.description,
  });

  // Create price in Stripe
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Number((Number(payload.price) * 100).toPrecision(2)), // Convert to cents
    currency: 'usd',
    ...(payload.duration && {
      recurring: {
        interval: payload.paymentType === 'Monthly' ? 'month' : 'year',
      },
    }),
  });

  const { _id, content, ...rest } = payload;

  // Create payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    metadata: rest,
  });

  // Prepare data for database
  const packageData = {
    ...payload,
    productId: product.id,
    priceId: price.id,
    ...(payload.paymentType === 'Monthly' && { totalWash: payload.totalWash }),
    ...(payload.paymentType === 'Yearly' && { totalWash: -1 }),
    ...(payload.paymentType === 'Single' && { totalWash: -1 }),
    paymentLink: paymentLink.url,
  };

  // Save to database
  const result = await Package.create(packageData);
  return result;
};

const getAllPackages = async () => {
  const result = await Package.find({ status: 'Active' });
  return result;
};

const getSinglePackage = async (id: string) => {
  const result = await Package.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }
  return result;
};

const updatePackage = async (id: string, payload: Partial<IPackage>) => {
  const plan = await Package.findById(id);
  if (!plan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }

  // Update Stripe product if title or description changed
  if (payload.title || payload.description) {
    await stripe.products.update(plan.productId as string, {
      name: payload.title as string,
      description: payload.description as string,
    });
  }

  // Update Stripe price if price changed
  if (payload.price) {
    // Deactivate old price
    await stripe.prices.update(plan.priceId as string, { active: false });

    // Create new price
    const newPrice = await stripe.prices.create({
      product: plan.productId as string,
      unit_amount: Number(payload.price) * 100,
      currency: 'usd',
      ...(payload.paymentType && {
        recurring: {
          interval: payload.paymentType === 'Monthly' ? 'month' : 'year',
        },
      }),
    });

    // Create new payment link
    const newPaymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: newPrice.id,
          quantity: 1,
        },
      ],
    });

    payload.priceId = newPrice.id;
    payload.paymentLink = newPaymentLink.url;
  }

  const result = await Package.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletePackage = async (id: string) => {
  const plan = await Package.findById(id);
  if (!plan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
  }

  // Deactivate Stripe product
  await stripe.products.update(plan.productId as string, { active: false });

  // Soft delete in database
  const result = await Package.findByIdAndUpdate(
    id,
    { status: 'Delete' },
    { new: true }
  );
  return result;
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
};
