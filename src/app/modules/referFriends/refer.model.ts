import mongoose, { model } from 'mongoose';
import { IRefer, ReferModel } from './refer.interface';

const referSchema = new mongoose.Schema<IRefer, ReferModel>(
  {
    email: {
      type: String,
      required: true,
    },
    referredBy: {
      type: String,
      ref: 'User',
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Refer = model<IRefer>('Refer', referSchema);