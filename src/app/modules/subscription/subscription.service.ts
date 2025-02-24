import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Subscription } from "./subscription.model";
import { User } from "../user/user.model";
import { Package } from "../package/package.model";
import stripe from "../../../config/stripe";

const createCheckoutSession = async (packageId: string, userId: string) => {
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (!user.stripeCustomerId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User does not have a stripe customer ID');
    }

    // Find the package
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
    }

    // Create checkout session using existing customer ID
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: packageData.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        userId: user._id.toString(),
        packageId: packageData._id.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    return session.url;
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating checkout session: ${error.message}`
    );
  }
};

const handleSubscriptionWebhook = async (event: any) => {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Only handle subscription mode sessions
        if (session.mode !== 'subscription') break;

        // Get the subscription ID from the session
        const subscriptionId = session.subscription as string;
        
        // Retrieve full subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price'],
        });

        // Find the package using price ID
        const priceId = subscription.items.data[0].price.id;
        const packageData = await Package.findOne({ priceId });
        if (!packageData) {
          throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
        }

        // Create subscription record in our database
        await Subscription.create({
          userId: session.metadata.userId,
          price_id: priceId,
          plan_type: packageData.paymentType,
          start_date: new Date(subscription.current_period_start * 1000),
          end_date: new Date(subscription.current_period_end * 1000),
          status: subscription.status,
          stripe_subscription_id: subscription.id,
          amount: packageData.price,
        });
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripe_subscription_id: updatedSubscription.id },
          {
            status: updatedSubscription.status,
            end_date: new Date(updatedSubscription.current_period_end * 1000),
          }
        );
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripe_subscription_id: deletedSubscription.id },
          { status: 'cancelled' }
        );
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripe_subscription_id: invoice.subscription },
          {
            end_date: new Date(invoice.lines.data[0].period.end * 1000),
          }
        );
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await Subscription.findOneAndUpdate(
          { stripe_subscription_id: failedInvoice.subscription },
          { status: 'expired' }
        );
        break;
    }
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error handling webhook: ${error.message}`
    );
  }
};

const cancelSubscription = async (subscriptionId: string) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription not found');
  }

  // Cancel subscription in Stripe
  await stripe.subscriptions.cancel(subscription.stripe_subscription_id);

  // Update subscription status in database
  subscription.status = 'cancelled';
  await subscription.save();

  return subscription;
};

const getUserSubscriptions = async (userId: string) => {
  const subscriptions = await Subscription.find({ userId });
  return subscriptions;
};

export const SubscriptionService = {
  createCheckoutSession,
  cancelSubscription,
  getUserSubscriptions,
  handleSubscriptionWebhook,
};