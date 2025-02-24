import { Model } from 'mongoose';

export type IPackage = {
    title: string;
    description: string;
    price: number;
    duration: '1 month' | '1 year'; 
    paymentType: 'Monthly' | 'Yearly';
    productId?: string;
    priceId?: string;
    paymentLink?: string;
    status: 'Active' | 'Delete'
};

export type PackageModel = Model<IPackage>;