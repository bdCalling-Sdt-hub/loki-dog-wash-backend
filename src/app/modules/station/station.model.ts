import mongoose, { model } from 'mongoose';
import { IStation, StationModel } from './station.interface';

const reviewSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    }
  }, {
    timestamps: true
  });

const stationSchema = new mongoose.Schema<IStation, StationModel>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    slots: {
        type: [String],
        required: true
    },
    review: {
        type: [reviewSchema]
    }
  },
  {
    timestamps: true,
  }
);


export const Station = model<IStation>('Station', stationSchema);