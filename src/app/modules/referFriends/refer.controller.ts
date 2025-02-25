import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReferService } from './refer.service';

const createRefer = catchAsync(async (req: Request, res: Response) => {
  const { email , referralCode} = req.body;
  const userId = req.user.id;
  const result = await ReferService.createRefer(email, userId, referralCode);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Refer sent successfully',
    data: result,
  });
});

export const ReferController = {
  createRefer,
};