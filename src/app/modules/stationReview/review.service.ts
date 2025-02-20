import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IReview } from '../station/station.interface';
import { Station } from '../station/station.model';

const createReviewToDB = async (payload: any)=> {
    const stationId = payload.stationId;
  const result = await Station.findOneAndUpdate({ _id: stationId }, { $push: { review: payload } }, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }
  return result;
};

export const ReviewService = {
    createReviewToDB
}