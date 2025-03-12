import { Model, Types } from 'mongoose';

export type ISave = {
  stationId: Types.ObjectId;
  userId: Types.ObjectId;
};

export type SaveModel = Model<ISave>;