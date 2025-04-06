import { Model, Schema, Types } from 'mongoose';

export enum SUBSCRIPTION_STATUS {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
}

export type ISubscription = {
  userId: Types.ObjectId;
  price_id?: string;
  plan_type: string;
  package_id?: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  status: string;
  stripe_subscription_id: string;
  amount: number;
  type: string;
};

export type SubscriptionModel = Model<ISubscription>;
