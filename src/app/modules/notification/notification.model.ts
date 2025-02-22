import { Schema, model} from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  replyUserId: {
    type: String,
    ref: 'User',
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = model<INotification>('Notification', notificationSchema);