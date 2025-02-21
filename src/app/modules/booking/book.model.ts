import mongoose, { model } from 'mongoose';
import { BookingModel, IBooking } from './book.interface';

const bookingSchema = new mongoose.Schema<IBooking, BookingModel>(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    stationId: {
      type: String,
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