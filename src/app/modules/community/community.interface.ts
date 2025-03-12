import { Model, Types } from 'mongoose';

export type ICommunityReply = {
  content: string;
  userId: string;
  createdAt?: Date;
};

export type ICommunity = {
  question?: string;
  file?: string;
  userId: Types.ObjectId;
  replies: ICommunityReply[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type CommunityModel = Model<ICommunity>;
