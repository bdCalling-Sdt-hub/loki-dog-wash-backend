import { Model } from 'mongoose';

export type ICommunityReply = {
  content: string;
  userId: string;
  createdAt?: Date;
};

export type ICommunity = {
  question: string;
  userId: string;
  replies: ICommunityReply[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type CommunityModel = Model<ICommunity>;
