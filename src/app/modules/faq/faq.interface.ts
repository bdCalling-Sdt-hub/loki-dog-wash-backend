import { Model, Types } from 'mongoose';

export enum OtherType {
  READ = 'read',
  WORKS = 'works',
  OPERATIONS = 'operations',
  TERMS = 'terms',
  PRIVACY = 'privacy',
  ABOUT = 'about',
}

export type IOthers = {
  _id: Types.ObjectId;
  content: string;
  type: OtherType;
  createdAt: Date;
  updatedAt: Date;
};

export type IFaq = {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OtherModel = Model<IOthers>;
export type FaqModel = Model<IFaq>;
