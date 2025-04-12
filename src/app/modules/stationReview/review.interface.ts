import { Model, Types } from 'mongoose';

export type IReview = {
  userId: Types.ObjectId;
  stationId: Types.ObjectId;
  bookingId: Types.ObjectId; // Add this field to reference the booking related t
  comment: string;
  rating: number;
};

export type ReviewModel = Model<IReview>;
