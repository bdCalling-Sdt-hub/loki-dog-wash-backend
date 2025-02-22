import { Model } from 'mongoose';

export type IReview = {
    userId: string;
    stationId: string;
    comment: string;
    rating: number;
  };

export type ReviewModel = Model<IReview>;