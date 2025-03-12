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
  images?: string[];
  rating:number;
  totalReviews:number;
  capacity:number;
  slots: [string];

};

export type StationModel = Model<IStation>;
