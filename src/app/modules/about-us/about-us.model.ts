import { model, Schema } from 'mongoose';
import { AboutModel, IAbout } from './about-us.interface';

const AboutSchema = new Schema<IAbout, AboutModel>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const About = model<IAbout, AboutModel>('About', AboutSchema);
