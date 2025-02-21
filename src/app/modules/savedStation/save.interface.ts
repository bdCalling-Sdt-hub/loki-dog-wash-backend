import { Model } from 'mongoose';

export type ISave = {
  stationId: string;
  userId: string;
};

export type SaveModel = Model<ISave>;