import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
    const stationId = req.params.stationId;
    const userId = req.user.id;
  const { ...reviewData } = req.body;
  const data = {
    ...reviewData,
    userId,
    stationId
  };
  const result = await ReviewService.createReviewToDB(data);
  sendResponse(res, { 
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
})

const getReviewByStationId = catchAsync(async (req: Request, res: Response) => {
    const stationId = req.params.stationId;
    const result = await ReviewService.getReviewByStationIdFromDB(stationId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Review retrieved successfully',
      data: result,
    });
  });

export const ReviewController = {
    createReview,
    getReviewByStationId
}