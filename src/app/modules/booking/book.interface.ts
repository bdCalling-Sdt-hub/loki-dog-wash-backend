import { Model, Types } from 'mongoose';
export type IBooking = {
  userId: Types.ObjectId;
  stationId: Types.ObjectId;
  // subscriptionId?: Types.ObjectId;
  date: Date;
};

export type BookingModel = Model<IBooking>;
