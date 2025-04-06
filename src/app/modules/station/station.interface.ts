import { Model } from 'mongoose';

export type IReview = {
  userId: string;
  name: string;
  comment: string;
  rating: number;
};

export type ISlots = {
  slot: string;
  timeCode: number;
};

export type IStation = {
  name: string;
  description: string;
  location: string;
  contact: string;
  images?: string[];
  rating: number;
  totalReviews: number;
  capacity: number;
  slots: ISlots[];
};

export type StationModel = Model<IStation>;
