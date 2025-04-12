import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Station } from '../station/station.model';
import { Review } from './review.model';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { IReview } from './review.interface';

/*const createReviewToDB = async (payload: any)=> {
    const stationId = payload.stationId;
  const result = await Station.findOneAndUpdate({ _id: stationId }, { $push: { review: payload } }, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }
  return result;
};*/

const createReviewToDB = async (
  user: JwtPayload,
  payload: IReview & { stationId: string }
) => {
  // First check if review already exists without a session
  const isReviewExist = await Review.findOne({
    userId: user.id,
    bookingId: payload.bookingId,
  }).lean();

  if (isReviewExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You have already reviewed this station with requested booking.'
    );
  }

  // Check if station exists
  const isStationExist = await Station.findById(payload.stationId).lean();
  if (!isStationExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'The requested station does not exist.'
    );
  }

  // Calculate average rating
  const avgRating = (
    (isStationExist.rating * isStationExist.totalReviews + payload.rating) /
    (isStationExist.totalReviews + 1)
  ).toFixed(2);

  // Start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create review
    const review = await Review.create([payload], { session });

    // Update station
    const station = await Station.findOneAndUpdate(
      { _id: payload.stationId },
      {
        $inc: { totalReviews: 1 },
        $set: { rating: Number(avgRating) },
      },
      { new: true, session }
    ).lean();

    if (!station) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Something went wrong while updating station...'
      );
    }

    // Commit transaction
    await session.commitTransaction();

    return review[0];
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.log(error);
    throw error;
  } finally {
    // End session
    await session.endSession();
  }
};

const getReviewByStationIdFromDB = async (stationId: string) => {
  const result = await Review.find({ stationId: stationId })
    .populate({
      path: 'userId',
      select: 'firstName lastName image',
    })
    .populate({
      path: 'stationId',
      select: 'name location image',
    });
  return result;
};

export const ReviewService = {
  createReviewToDB,
  getReviewByStationIdFromDB,
};
