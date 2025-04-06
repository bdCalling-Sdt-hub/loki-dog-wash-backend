import { parse } from 'date-fns';
import { IBooking } from './book.interface';
import { Booking } from './book.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { SubscriptionService } from '../subscription/subscription.service';

export const parseDateInUTC = (dateString: string, format: string): Date => {
  // Parse the date in the local timezone
  const localDate = parse(dateString, format, new Date());

  // Convert the local date to UTC
  const utcDate = new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds()
    )
  );

  return utcDate;
};

export const purchaseSingleBooking = async (
  bookingData: IBooking,
  packageId: string,
  userId: string
) => {
  const result = await Booking.create(bookingData);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create booking');
  }

  const url = await SubscriptionService.createCheckoutSession(
    packageId,
    userId,
    'payment',
    result._id.toString()
  );

  return {
    url: url,
    booking: null,
    isPaymentRequired: true,
  };
};
