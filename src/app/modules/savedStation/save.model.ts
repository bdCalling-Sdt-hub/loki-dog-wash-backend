import mongoose, { model } from 'mongoose';
import { ISave, SaveModel } from './save.interface';

const savedSchema = new mongoose.Schema<ISave, SaveModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Save = model<ISave>('Save', savedSchema);