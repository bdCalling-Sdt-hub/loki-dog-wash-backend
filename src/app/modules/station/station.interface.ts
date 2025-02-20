import { Model } from 'mongoose';

export type IReview = {
  userId: string;
  name: string;
  comment: string;
  rating: number;
};

export type IStation = {
  name: string;
  description: string;
  location: string;
  contact: string;
  image?: string;
  slots: [string];
  review?: IReview[];
};

export type StationModel = Model<IStation>;
