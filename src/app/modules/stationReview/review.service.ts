import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IReview } from '../station/station.interface';
import { Station } from '../station/station.model';
import { Review } from './review.model';
import mongoose from 'mongoose';

/*const createReviewToDB = async (payload: any)=> {
    const stationId = payload.stationId;
  const result = await Station.findOneAndUpdate({ _id: stationId }, { $push: { review: payload } }, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }
  return result;
};*/

const createReviewToDB = async (payload: IReview & { stationId: string }) => {
 
  const session = await   mongoose.startSession();

  try{
     session.startTransaction();

    const isStationExist = await Station.findById(payload.stationId).lean().session(session);

    if(!isStationExist) throw new ApiError(StatusCodes.BAD_REQUEST, "The requested station does not exist.");


    const avgRating = ((isStationExist.rating * isStationExist.totalReviews + payload.rating) / (isStationExist.totalReviews + 1)).toFixed(2);

    const [review, station] = await Promise.all([
      Review.create([payload], { session }),
      Station.findOneAndUpdate(
        { _id: payload.stationId },
        {
          $inc: { totalReviews: 1 },
          $set: {
            rating: Number(avgRating),
          },
        },
        { new: true, session }
      ).lean().session(session)
    ]);


    if (!station) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
    }

    await session.commitTransaction();
    await session.endSession();
return review
  }catch(error){
    await session.abortTransaction();
    await session.endSession();
    console.log(error)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create review!');
  }finally{
    await session.endSession()
  }

}

const getReviewByStationIdFromDB = async (stationId: string) => {
  const result = await Review.find({ stationId: stationId })
    .populate({
      path: 'userId',
      select: 'firstName lastName image'
    })
    .populate({
      path: 'stationId',
      select: 'name location image'
    });
  return result;
}

export const ReviewService = {
    createReviewToDB,
    getReviewByStationIdFromDB
}