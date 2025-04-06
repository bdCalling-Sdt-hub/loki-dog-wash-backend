import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Subscription } from './subscription.model';
import { User } from '../user/user.model';
import { Package } from '../package/package.model';
import stripe from '../../../config/stripe';
import { Booking } from '../booking/book.model';
import { Types } from 'mongoose';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';

const createCheckoutSession = async (
  packageId: string,
  userId: string,
  paymentMode: 'subscription' | 'payment' = 'subscription',
  bookingId?: string
) => {
  try {
    // Find the user
    const user = await User.findById(new Types.ObjectId(userId));

    if (!user || !user.stripeCustomerId) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Please create an stripe account first, then try again.'
      );
    }

    // Find the package
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Package not found, try again.'
      );
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
      mode: paymentMode,
      metadata: {
        userId: user._id.toString(),
        packageId: packageData._id.toString(),
        ...(bookingId && { bookingId }),
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
    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        console.log(`Checkout session completed: ${JSON.stringify(session)}`);

        // Only handle subscription mode sessions
        if (session.mode !== 'subscription') {
          console.log('Not a subscription mode session, skipping');
          break;
        }

        // Get the subscription ID from the session
        const subscriptionId = session.subscription as string;
        console.log(`Subscription ID from session: ${subscriptionId}`);

        if (!subscriptionId) {
          console.error('No subscription ID found in session');
          break;
        }

        // Retrieve full subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId,
          {
            expand: ['items.data.price'],
          }
        );

        console.log(`Retrieved subscription from Stripe: ${subscription.id}`);

        // Find the package using price ID
        const priceId = subscription.items.data[0].price.id;
        const packageData = await Package.findOne({ priceId });

        if (!packageData) {
          console.error(`Package not found for price ID: ${priceId}`);
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Package not found for price ID: ${priceId}`
          );
        }

        console.log(
          `Found package: ${packageData._id} for price ID: ${priceId}`
        );

        // Check if subscription already exists to prevent duplicates
        const existingSubscription = await Subscription.findOne({
          stripe_subscription_id: subscription.id,
        });

        if (existingSubscription) {
          console.log(
            `Subscription already exists in database: ${existingSubscription._id}`
          );
        } else {
          console.log(
            `Creating new subscription record for user: ${session.metadata.userId}`
          );

          // Prepare subscription data
          const subscriptionData = {
            userId: session.metadata.userId,
            price_id: priceId,
            package_id: packageData._id,
            plan_type: packageData.paymentType,
            start_date: new Date(subscription.current_period_start * 1000),
            end_date: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
            stripe_subscription_id: subscription.id,
            amount: packageData.price,
          };

          const user = await User.findById(session.metadata.userId);

          if (!user) {
            console.error(`User not found for ID: ${session.metadata.userId}`);
            throw new ApiError(
              StatusCodes.NOT_FOUND,
              `User not found for ID: ${session.metadata.userId}`
            );
          }

          //send mail to user
          const subscriptionMail = emailTemplate.subscriptionPurchased({
            email: user.email,
            planName: packageData.title,
            amount: packageData.price,
            billingPeriod: subscriptionData.end_date.toISOString(),
          });

          emailHelper.sendEmail(subscriptionMail);

          console.log(
            `Subscription data to save: ${JSON.stringify(subscriptionData)}`
          );

          // Create subscription record in our database
          try {
            const newSubscription = await Subscription.create(subscriptionData);
            console.log(
              `Successfully created subscription: ${newSubscription._id}`
            );
          } catch (error: any) {
            console.error(
              `Error creating subscription in database: ${error.message}`
            );
            throw new ApiError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              `Failed to save subscription: ${error.message}`
            );
          }
        }
        break;

      case 'payment_intent.payment_failed':
        {
          const session = event.data.object;

          if (!session.mode || session.mode !== 'subscription') {
            console.log(`Deleting booking: ${session?.metadata?.bookingId}`);
            await Booking.findOneAndDelete({
              _id: session?.metadata?.bookingId,
            });
          }
        }
        break;

      case 'checkout.session.expired':
        {
          const session = event.data.object;

          if (!session.mode || session.mode !== 'subscription') {
            console.log(`Deleting booking: ${session?.metadata?.bookingId}`);
            await Booking.findOneAndDelete({
              _id: session?.metadata?.bookingId,
            });
          }
        }
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        console.log(`Subscription updated event: ${updatedSubscription.id}`);

        const updated = await Subscription.findOneAndUpdate(
          { stripe_subscription_id: updatedSubscription.id },
          {
            status: updatedSubscription.status,
            end_date: new Date(updatedSubscription.current_period_end * 1000),
          },
          { new: true }
        );

        if (!updated) {
          console.error(
            `Failed to update subscription ${updatedSubscription.id} - not found in database`
          );

          // Try to find the customer ID from Stripe subscription
          const customer = updatedSubscription.customer;
          if (customer) {
            const user = await User.findOne({ stripeCustomerId: customer });
            if (user) {
              console.log(
                `Found user ${user._id} for subscription ${updatedSubscription.id}, creating subscription record`
              );

              // Try to find the package
              const items = updatedSubscription.items.data;
              if (items && items.length > 0) {
                const priceId = items[0].price.id;
                const packageData = await Package.findOne({ priceId });

                if (packageData) {
                  // Create subscription record since it doesn't exist

                  const subscriptionData = {
                    userId: user._id.toString(),
                    price_id: priceId,
                    package_id: packageData._id,
                    plan_type: packageData.paymentType,
                    start_date: new Date(
                      updatedSubscription.current_period_start * 1000
                    ),
                    end_date: new Date(
                      updatedSubscription.current_period_end * 1000
                    ),
                    status: updatedSubscription.status,
                    stripe_subscription_id: updatedSubscription.id,
                    amount: packageData.price,
                  };

                  await Subscription.create({
                    ...subscriptionData,
                  });

                  //send mail to user
                  const subscriptionMail = emailTemplate.subscriptionPurchased({
                    email: user.email,
                    planName: packageData.title,
                    amount: packageData.price,
                    billingPeriod: subscriptionData.end_date.toISOString(),
                  });

                  emailHelper.sendEmail(subscriptionMail);

                  console.log(
                    `Created missing subscription record for ${updatedSubscription.id}`
                  );
                }
              }
            }
          }
        } else {
          console.log(`Successfully updated subscription: ${updated._id}`);
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        console.log(`Subscription deleted event: ${deletedSubscription.id}`);

        const [canceled, populatedSubscription] = await Promise.all([
          Subscription.findOneAndUpdate(
            { stripe_subscription_id: deletedSubscription.id },
            { status: 'canceled' },
            { new: true }
          ),
          Subscription.findOne({
            stripe_subscription_id: deletedSubscription.id,
          })
            .populate<{ package_id: { title: string } }>('package_id', {
              title: 1,
            })
            .lean(),
        ]);

        if (!populatedSubscription)
          throw new ApiError(StatusCodes.NOT_FOUND, 'Subscription not found');

        if (!canceled) {
          console.error(
            `Failed to cancel subscription ${deletedSubscription.id} - not found in database`
          );
        } else {
          console.log(`Successfully cancelled subscription: ${canceled._id}`);
          //send mail to user

          const user = await User.findById(canceled.userId);

          if (!user) {
            console.error(`User not found for ID: ${canceled.userId}`);
            throw new ApiError(
              StatusCodes.NOT_FOUND,
              `User not found for ID: ${canceled.userId}`
            );
          }
          const subscriptionMail = emailTemplate.subscriptionCanceled({
            email: user.email,
            planName: populatedSubscription.package_id.title,
            endDate: canceled.end_date.toISOString(),
          });

          emailHelper.sendEmail(subscriptionMail);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log(
          `Invoice payment succeeded event for subscription: ${invoice.subscription}`
        );

        if (invoice.subscription) {
          // First check if subscription exists in our database
          const existingSub = await Subscription.findOne({
            stripe_subscription_id: invoice.subscription,
          });

          // If subscription doesn't exist, we need to create it
          if (!existingSub) {
            console.log(
              `Subscription ${invoice.subscription} not found in database, fetching from Stripe`
            );

            try {
              // Fetch full subscription details from Stripe
              const stripeSubscription = await stripe.subscriptions.retrieve(
                invoice.subscription,
                {
                  expand: ['items.data.price', 'customer'],
                }
              );

              // Find user by Stripe customer ID
              const user = await User.findOne({
                stripeCustomerId: stripeSubscription.customer,
              });

              if (user) {
                // Find package by price ID
                const priceId = stripeSubscription.items.data[0].price.id;
                const packageData = await Package.findOne({ priceId });

                if (packageData) {
                  // Create subscription record
                  await Subscription.create({
                    userId: user._id.toString(),
                    price_id: priceId,
                    package_id: packageData._id, // Corrected field name from packageId to package_id
                    plan_type: packageData.paymentType,
                    start_date: new Date(
                      stripeSubscription.current_period_start * 1000
                    ),
                    end_date: new Date(
                      stripeSubscription.current_period_end * 1000
                    ),
                    status: stripeSubscription.status,
                    stripe_subscription_id: stripeSubscription.id,
                    amount: packageData.price,
                  });

                  console.log(
                    `Created missing subscription record for ${stripeSubscription.id}`
                  );
                } else {
                  console.error(`Package not found for price ID: ${priceId}`);
                }
              } else {
                console.error(
                  `User not found for customer ID: ${stripeSubscription.customer}`
                );
              }
            } catch (error: any) {
              console.error(
                `Error fetching subscription from Stripe: ${error.message}`
              );
            }
          } else {
            // Update existing subscription
            const updated = await Subscription.findOneAndUpdate(
              { stripe_subscription_id: invoice.subscription },
              {
                end_date: new Date(invoice.lines.data[0].period.end * 1000),
              },
              { new: true }
            );

            if (updated) {
              console.log(`Updated subscription end date: ${updated._id}`);
            } else {
              console.error(
                `Failed to update subscription ${invoice.subscription}`
              );
            }
          }
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        console.log(
          `Invoice payment failed event for subscription: ${failedInvoice.subscription}`
        );

        if (failedInvoice.subscription) {
          const expired = await Subscription.findOneAndUpdate(
            { stripe_subscription_id: failedInvoice.subscription },
            { status: 'expired' },
            { new: true }
          );

          if (!expired) {
            console.error(
              `Failed to expire subscription ${failedInvoice.subscription} - not found in database`
            );
          } else {
            console.log(`Set subscription ${expired._id} status to expired`);
          }
        }
        break;
    }
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
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
  subscription.status = 'canceled';
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
