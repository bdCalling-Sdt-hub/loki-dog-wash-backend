import mongoose, { model, Schema } from 'mongoose';
import { ISave, SaveModel } from './save.interface';

const savedSchema = new mongoose.Schema<ISave, SaveModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stationId: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Save = model<ISave>('Save', savedSchema);