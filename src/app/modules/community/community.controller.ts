import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommunityService } from './community.service';
import { ICommunity } from './community.interface';
import { getSingleFilePath } from '../../../shared/getFilePath';

const askQuestion = catchAsync(async (req: Request, res: Response) => {
  const { question } = req.body;

  const file = req.files ? getSingleFilePath(req.files, 'image') || 
                                getSingleFilePath(req.files, 'doc') || 
                                getSingleFilePath(req.files, 'media') 
                              : undefined;

  const result = await CommunityService.askQuestion(req.user, { question, file });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Question posted successfully',
    data: result,
  });
});


const replyToQuestion = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const questionId = req.params.id;

  const result = await CommunityService.replyToQuestion(req.user, questionId, content);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reply posted successfully',
    data: result,
  });
});
export const CommunityController = {
  askQuestion,
  replyToQuestion
};