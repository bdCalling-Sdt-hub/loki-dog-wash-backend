import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IReview } from '../station/station.interface';
import { Station } from '../station/station.model';
import { Review } from './review.model';

/*const createReviewToDB = async (payload: any)=> {
    const stationId = payload.stationId;
  const result = await Station.findOneAndUpdate({ _id: stationId }, { $push: { review: payload } }, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }
  return result;
};*/

const createReviewToDB = async (payload: IReview) => {
  const result = await Review.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }
  return result;
}

const getReviewByStationIdFromDB = async (stationId: string) => {
  const result = await Review.find({ stationId: stationId })
    .populate({
      path: 'userId',
      select: 'firstName lastName'
    })
    .populate({
      path: 'stationId',
      select: 'name location'
    });
  return result;
}

export const ReviewService = {
    createReviewToDB,
    getReviewByStationIdFromDB
}