import mongoose, { model } from 'mongoose';
import { IPackage, PackageModel } from './package.interface';

const savedSchema = new mongoose.Schema<IPackage, PackageModel>(
  {
    title: {
      type: String,
      required: true,
    },
    totalWash: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      enum: ['1 month', '1 year'],
      // required: true,
    },
    paymentType: {
      type: String,
      enum: ['Monthly', 'Yearly', 'Single'],
      // required: true,
    },
    productId: {
      type: String,
    },
    priceId: {
      type: String,
    },
    paymentLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Delete'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

export const Package = model<IPackage>('Package', savedSchema);
