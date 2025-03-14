import { Model, Types } from 'mongoose';

export type IRefer = {
    email: string;
    referredBy: Types.ObjectId;
    referralCode: string;
    isVerified: boolean;
}

export type ReferModel = Model<IRefer, Record<string, unknown>>;