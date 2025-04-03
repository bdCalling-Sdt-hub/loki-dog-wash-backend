import { model, Schema } from 'mongoose';
import { FaqModel, IFaq, IOthers, OtherModel } from './faq.interface';

const otherSchema = new Schema<IOthers, OtherModel>(
  {
    content: {
      type: String,
    },
    type: {
      type: String,
      enum: ['read', 'works', 'terms', 'privacy', 'operations', 'about'],
      required: true,
    },
  },
  { timestamps: true }
);

const faqSchema = new Schema<IFaq, FaqModel>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Others = model<IOthers, OtherModel>('Others', otherSchema);
export const Faq = model<IFaq, FaqModel>('Faq', faqSchema);
