import { Model } from 'mongoose';

export type IAbout = {
  title?: string;
  description: string;
}

export type AboutModel = Model<IAbout>;
