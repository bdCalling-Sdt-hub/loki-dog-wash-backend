import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking } from './book.interface';
import { Booking } from './book.model';
import { parse, format } from 'date-fns';
import { Types } from 'mongoose';

interface BookingPayload {
    userId: string;
    stationId: string;
    date: string;
    time: string;
  }
  
  const createBookingToDB = async (payload: BookingPayload): Promise<IBooking | null> => {
    try {
      // Parse the date and time strings
      const dateObj = parse(payload.date, 'dd MMMM, yyyy', new Date());
      
      // Handle AM/PM properly
      let [hourStr, amPm] = payload.time.split(' ');
      let hour = parseFloat(hourStr);
      
      // Convert to 24-hour format
      if (amPm.toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
      } else if (amPm.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      
      // Set the time on the date object
      dateObj.setHours(hour);
      dateObj.setMinutes(0);
      dateObj.setSeconds(0);
      
      // Create the booking with the formatted date
      const bookingData: IBooking = {
        userId: new Types.ObjectId(payload.userId),
        stationId: new Types.ObjectId(payload.stationId),
        date: dateObj
      };
      
      const result = await Booking.create(bookingData);
      if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create booking');
      }
      return result;
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST, 
        `Failed to parse date or time: ${error.message}`
      );
    }
  };
const getAllBookingFromDB = async (userId: Types.ObjectId, status?: "active" | 'history') => {

  let query;
  if (status === 'active') {
    query = { $gte: new Date() };
  } else if (status === 'history') {
    query = { $lt: new Date() };
  }


  const result = await Booking.find({userId: userId, ...(status ? {date: query} : {})}).populate({
    path: 'stationId',
    select: {name: 1, location: 1, contact:1, image:1, description:1}
  });
  if(!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get booking');
  }
  return result;
};

export const BookingService = {
  createBookingToDB,
  getAllBookingFromDB
};