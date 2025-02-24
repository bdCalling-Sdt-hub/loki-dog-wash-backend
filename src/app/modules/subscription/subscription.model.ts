import mongoose, { model } from 'mongoose';
import { ISubscription, SubscriptionModel } from './subscription.interface';

const subscriptionSchema = new mongoose.Schema<ISubscription, SubscriptionModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    price_id: {
      type: String
    },
    plan_type: {
      type: String,
      required: true,
      enum: ['Monthly', 'Yearly'],
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    stripe_subscription_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);