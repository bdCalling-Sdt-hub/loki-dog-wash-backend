import mongoose, { model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new mongoose.Schema<IReview, ReviewModel>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    stationId: {
      type: String,
      ref: 'Station',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview>('Review', reviewSchema);
