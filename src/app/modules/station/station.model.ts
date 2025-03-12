import mongoose, { model } from 'mongoose';
import { IStation, StationModel } from './station.interface';

const reviewSchema = new mongoose.Schema({
    userId: {
      type: String,
      ref: 'User',
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
    totalReviews: {
      type: Number,
      default: 0
    },
    rating:{
      type:Number,
      default:0
    },
    capacity:{
      type:Number,
      required:true
    },
    slots: {
        type: [String],
        required: true
    },
    },
   
  
  {
    timestamps: true,
  }
);


export const Station = model<IStation>('Station', stationSchema);