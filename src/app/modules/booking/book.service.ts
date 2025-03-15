import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking } from './book.interface';
import { Booking } from './book.model';
import { parse, format } from 'date-fns';
import { Types } from 'mongoose';
import { Subscription } from '../subscription/subscription.model';
import { parseDateInUTC } from './booking.utils';
import { SubscriptionService } from '../subscription/subscription.service';
import { Package } from '../package/package.model';

interface BookingPayload {
    userId: string;
    stationId: string;
    date: string;
    time: string;
  }

  
  const createBookingToDB = async (payload: BookingPayload)=> {
    try {
    // Parse the date string
      const date = new Date(payload.date);

      // Parse the time string
      const [time, modifier] = payload.time.split(' ');
      let [hours, minutes] = time.split('.');

      if (modifier.toLowerCase() === 'pm' && hours !== '12') {
        hours = (parseInt(hours, 10) + 12).toString();  // Convert to 24-hour format
      }

      if (modifier.toLowerCase() === 'am' && hours === '12') {
        hours = '00';
      }

      // Set the time on the date object
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);

      // Check for subscription
      const [subscription, existingBooking] = await Promise.all([
        Subscription.findOne({ userId: new Types.ObjectId(payload.userId) }).lean(),
        Booking.findOne({ stationId: new Types.ObjectId(payload.stationId), date: date }).lean()
      ]);

      // Create booking
      const bookingData: IBooking = {
        userId: new Types.ObjectId(payload.userId),
        stationId: new Types.ObjectId(payload.stationId),
        date: date,
        };

        if (existingBooking) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Slot is already booked');
        }
      if(!subscription) {
        const packageData = await Package.findOne({paymentType: 'Single'}).lean();
        if(!packageData) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Something went wrong, please try again.');
        }


        const result = await Booking.create(bookingData);
        if (!result) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create booking');
        }

       const url= await SubscriptionService.createCheckoutSession( packageData._id.toString(), payload.userId, 'payment', result._id.toString());

        return url;
      }else{
        const result = await Booking.create(bookingData);
        if (!result) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create booking');
        }
        return result;
      }
  

    } catch (error: any) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
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
  }).lean();
  if(!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get booking');
  }

  //before returning parse the date to local time
  result.forEach((booking: any) => {
    booking.date = format(new Date(booking.date), 'yyyy-MM-dd hh:mm a');  // Added time and AM/PM
  });

  return result;
};

export const BookingService = {
  createBookingToDB,
  getAllBookingFromDB
};