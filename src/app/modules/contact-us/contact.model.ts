import mongoose, { model } from 'mongoose';
import { ContactModel, IContact } from './contact.interface';

const contactSchema = new mongoose.Schema<IContact, ContactModel>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Contact = model<IContact>('Contact', contactSchema);