import mongoose, { model } from 'mongoose';
import { ISave, SaveModel } from './save.interface';

const savedSchema = new mongoose.Schema<ISave, SaveModel>(
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
    }
  },
  {
    timestamps: true,
  }
);

export const Save = model<ISave>('Save', savedSchema);