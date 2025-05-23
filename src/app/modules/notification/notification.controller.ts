import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationServices } from './notification.service';
import pick from '../../../shared/pick';

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);
  const { type } = req.query;
  const lowerCaseType = type?.toString().toLowerCase();
  const result = await NotificationServices.getNotifications(
    user,
    paginationOptions,
    lowerCaseType as 'all' | 'announcement'
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const getSingleNotification = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await NotificationServices.getSingleNotification(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Notification retrieved successfully',
      data: result,
    });
  }
);

const createAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await NotificationServices.createAnnouncement(payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Announcement created successfully',
    data: result,
  });
});

const getPreviousAnnouncement = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationServices.getPreviousAnnouncement();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Previous announcement retrieved successfully',
      data: result,
    });
  }
);

export const NotificationController = {
  getNotifications,
  getSingleNotification,
  createAnnouncement,
  getPreviousAnnouncement,
};
