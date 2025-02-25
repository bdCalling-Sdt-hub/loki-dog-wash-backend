import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import sendResponse from '../../../shared/sendResponse';
import { AboutService } from './about-us.service';


const createAbout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description } = req.body;
    if (!title || !description) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Title and description are required'
      );
    }
    const result = await AboutService.createAboutToDB({
      title,
      description,
    });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'About created successfully',
      data: result,
    });
  }
);

const getAllAbout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AboutService.getAllAboutFromDB();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'About fetched successfully',
      data: result,
    });
  }
);

export const AboutController = {
  createAbout,
  getAllAbout
};
