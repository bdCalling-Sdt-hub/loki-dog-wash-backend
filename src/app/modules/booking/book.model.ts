import mongoose, { model, Schema } from 'mongoose';
import { BookingModel, IBooking } from './book.interface';

const bookingSchema = new mongoose.Schema<IBooking, BookingModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stationId: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBooking>('Booking', bookingSchema);