import mongoose, { model, Schema } from 'mongoose';
import { IRefer, ReferModel } from './refer.interface';

const referSchema = new mongoose.Schema<IRefer, ReferModel>(
  {
    email: {
      type: String,
      required: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Refer = model<IRefer>('Refer', referSchema);