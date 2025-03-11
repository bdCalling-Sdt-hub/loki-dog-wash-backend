import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './book.service';

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const stationId = req.params.stationId;
  const bookingData = {userId, stationId, ...req.body};
  const result = await BookingService.createBookingToDB(bookingData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const {status} = req.query;
  const result = await BookingService.getAllBookingFromDB(userId, status as "active" | 'history' );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All booking retrieved successfully',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBooking
};