import { Model } from 'mongoose';
export type IBooking = {
  userId: string;
  stationId: string;
  date: Date;
};

export type BookingModel = Model<IBooking>;
