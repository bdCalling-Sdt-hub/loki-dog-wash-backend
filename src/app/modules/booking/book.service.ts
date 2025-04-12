import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking } from './book.interface';
import { Booking } from './book.model';
import { format } from 'date-fns';
import { Types } from 'mongoose';
import { Subscription } from '../subscription/subscription.model';
import { purchaseSingleBooking } from './booking.utils';

import { Package } from '../package/package.model';
import { User } from '../user/user.model';
import { DateTime } from 'luxon';
import { generateTimeCode } from '../station/station.utils';
import { Review } from '../stationReview/review.model';

interface BookingPayload {
  userId: string;
  stationId: string;
  date: string;
  time: string;
}

const createBookingToDB = async (payload: BookingPayload) => {
  try {
    // Parse the date string
    const date = new Date(payload.date);

    // Parse the time string
    const [time, modifier] = payload.time.split(' ');
    let [hours, minutes] = time.split('.');

    if (modifier.toLowerCase() === 'pm' && hours !== '12') {
      hours = (parseInt(hours, 10) + 12).toString(); // Convert to 24-hour format
    }

    if (modifier.toLowerCase() === 'am' && hours === '12') {
      hours = '00';
    }

    // Set the time on the date object
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);

    const timeCode = generateTimeCode(payload.time);

    // Check for subscription
    const [subscription, existingBooking, user] = await Promise.all([
      Subscription.findOne({
        userId: new Types.ObjectId(payload.userId),
        status: 'active',
      })
        .populate({
          path: 'userId',
          select: { stripeCustomerId: 1 },
        })
        .populate<{ package_id: { paymentType: string; totalWash: number } }>({
          path: 'package_id',
          select: { paymentType: 1, totalWash: 1 },
        })
        .lean(),
      Booking.findOne({
        stationId: new Types.ObjectId(payload.stationId),
        timeCode: timeCode,
        date: date,
      }).lean(),
      User.findById(new Types.ObjectId(payload.userId)).lean(),
    ]);

    if (!user || user.stripeCustomerId === null) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Create a stripe account first, and then book a slot.'
      );
    }

    // Create booking
    const bookingData: IBooking = {
      userId: new Types.ObjectId(payload.userId),
      stationId: new Types.ObjectId(payload.stationId),
      timeCode: Number(timeCode),
      // ...(subscription?._id && { subscriptionId: subscription._id }),
      date: date,
    };

    if (existingBooking) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Slot is already booked');
    }
    if (!subscription) {
      const packageData = await Package.findOne({
        paymentType: 'Single',
      }).lean();
      if (!packageData) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Something went wrong, please try again.'
        );
      }

      //calculate if the crated user is a new user or not if the new user is created only for 1 day
      if (
        user.createdAt &&
        user.createdAt < new Date(new Date().setDate(new Date().getDate() - 1))
      ) {
        //also if the user already booked a slot
        const existingBooking = await Booking.countDocuments({
          userId: new Types.ObjectId(payload.userId),
        });

        if (existingBooking > 0) {
          const singleBooking = await purchaseSingleBooking(
            bookingData,
            packageData._id.toString(),
            payload.userId
          );
          return singleBooking;
        }

        const result = await Booking.create(bookingData);
        return {
          url: '',
          booking: result,
          isPaymentRequired: false,
        };
      }
      const result = await purchaseSingleBooking(
        bookingData,
        packageData._id.toString(),
        payload.userId
      );

      return result;
      // const result = await Booking.create(bookingData);
      // if (!result) {
      //   throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create booking');
      // }

      // const url = await SubscriptionService.createCheckoutSession(
      //   packageData._id.toString(),
      //   payload.userId,
      //   'payment',
      //   result._id.toString()
      // );

      // return {
      //   url: url,
      //   booking: null,
      //   isPaymentRequired: true,
      // };
    } else {
      // Check if the subscription is valid
      //also see if the the total wash is less than the package limit
      const totalWash = await Booking.countDocuments({
        userId: new Types.ObjectId(payload.userId),
        date: {
          $gte: subscription.start_date,
          $lte: new Date(subscription.end_date),
        },
      });

      if (
        Number(subscription.package_id.totalWash) !== -1 &&
        totalWash >= subscription.package_id.totalWash
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'You have reached your limit for this month. Please visit the next month to book a new slot.'
        );
      }

      const result = await Booking.create(bookingData);
      if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create booking');
      }
      return {
        url: '',
        booking: result,
        isPaymentRequired: false,
      };
    }
  } catch (error: any) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
  }
};

const getAllBookingFromDB = async (
  userId: Types.ObjectId,
  status?: 'active' | 'history'
) => {
  let query;
  if (status === 'active') {
    query = { $gte: new Date() };
  } else if (status === 'history') {
    query = { $lt: new Date() };
  }

  const result = await Booking.find({
    userId: userId,
    ...(status ? { date: query } : {}),
  })
    .populate({
      path: 'stationId',
      select: { name: 1, location: 1, contact: 1, images: 1, description: 1 },
    })
    .lean();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get booking');
  }

  //get all booking ids
  const bookingIds = result.map((booking: any) => booking._id);
  console.log(bookingIds);
  //get reviews for each booking
  const reviews = await Review.find(
    {
      userId: userId,
      bookingId: { $in: bookingIds },
    },
    { rating: 1, comment: 1, bookingId: 1, createdAt: 1 }
  );

  //add reviews to each booking
  result.forEach((booking: any) => {
    booking.reviews = reviews.filter(
      (review: any) => review.bookingId.toString() === booking._id.toString()
    );
  });

  //before returning parse the date to local time
  result.forEach((booking: any) => {
    booking.date = format(new Date(booking.date), 'yyyy-MM-dd hh:mm a'); // Added time and AM/PM
  });

  return result;
};

export const BookingService = {
  createBookingToDB,
  getAllBookingFromDB,
};
