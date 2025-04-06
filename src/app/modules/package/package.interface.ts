import { Model, Types } from 'mongoose';

export type IPackage = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  totalWash: number;
  content: string[];
  price: number;
  duration: '1 month' | '1 year';
  paymentType: 'Monthly' | 'Yearly' | 'Single';
  productId?: string;
  priceId?: string;
  paymentLink?: string;
  status: 'Active' | 'Delete';
};

export type PackageModel = Model<IPackage>;
