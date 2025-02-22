import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CommunityService } from './community.service';
import { ICommunity } from './community.interface';

const askQuestion = catchAsync(async (req: Request, res: Response) => {
  const { question } = req.body;
  const userId = req.user.id;

  const result = await CommunityService.askQuestion({ question, userId });

  sendResponse<ICommunity>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Question posted successfully',
    data: result,
  });
});

const replyToQuestion = catchAsync(async (req: Request, res: Response) => {
  const { content } = req.body;
  const userId = req.user.id;
  const questionId = req.params.questionId;

  const result = await CommunityService.replyToQuestion(questionId, {
    content,
    userId,
  });

  sendResponse<ICommunity>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reply posted successfully',
    data: result,
  });
});

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const questions = await CommunityService.getAllQuestions();

  sendResponse<ICommunity[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Questions retrieved successfully',
    data: questions,
  });
});

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const notifications = await CommunityService.getUserNotifications(userId);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
    });
  });
  
  const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    const notification = await CommunityService.markNotificationAsRead(notificationId);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  });

export const CommunityController = {
  askQuestion,
  replyToQuestion,
  getAllQuestions,
  getUserNotifications,
  markNotificationAsRead
};