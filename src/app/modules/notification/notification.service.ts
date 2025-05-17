import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { IPaginationOptions } from '../../../types/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { sendNotification } from '../../../helpers/sendNotificationHelper';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';

const createNotification = async (payload: INotification) => {
  const result = await Notification.create(payload);
  return result;
};

const getNotifications = async (
  user: JwtPayload,
  paginationOptions: IPaginationOptions,
  type: 'all' | 'announcement' = 'all'
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  let query;

  if (user.role === USER_ROLES.SUPER_ADMIN || user.role === USER_ROLES.ADMIN) {
    query = { receiverId: user.id };
  } else {
    query =
      type.toLowerCase() === 'announcement'
        ? { type: 'ANNOUNCEMENT' }
        : { $or: [{ receiverId: user.id }, { type: { $ne: 'ANNOUNCEMENT' } }] };
  }
  console.log(query);
  const result = await Notification.find(query)
    .populate({
      path: 'senderId',
      select: 'firstName image',
    })
    .populate({
      path: 'receiverId',
      select: 'firstName image',
    })
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get notifications');
  }
  const total = await Notification.countDocuments(query);
  return {
    meta: {
      page,
      limit,
      total: total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

const createAnnouncement = async (payload: INotification) => {
  payload.type = 'ANNOUNCEMENT';

  await sendNotification(
    'announcement',
    config.announcement_receiving_code!,
    payload
  );
};

const getSingleNotification = async (id: string) => {
  await Notification.findOneAndUpdate(
    { _id: id, type: 'QUESTION_REPLY' },
    { $set: { read: true } },
    { new: true }
  );

  return 'Updated successfully';
};

const getPreviousAnnouncement = async () => {
  const result = await Notification.find({
    type: 'ANNOUNCEMENT',
  }).lean();
  return result;
};

export const NotificationServices = {
  createNotification,
  getNotifications,
  getSingleNotification,
  createAnnouncement,
  getPreviousAnnouncement,
};
