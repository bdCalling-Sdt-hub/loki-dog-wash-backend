import { Model } from 'mongoose';

export type IRefer = {
    email: string;
    referredBy: string;
    referralCode: string;
}

export type ReferModel = Model<IRefer, Record<string, unknown>>;