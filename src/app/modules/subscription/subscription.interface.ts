import { Model, Schema, Types } from "mongoose";

export type ISubscription = {
  userId: Types.ObjectId;
  price_id?: string;
  plan_type: string;
  start_date: Date;
  end_date: Date;
  status: string;
  stripe_subscription_id: string;
  amount: number;
  type: string;
}

export type SubscriptionModel = Model<ISubscription>;
