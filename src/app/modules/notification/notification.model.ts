import { Schema, model} from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',

  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',

  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',

  },
  read: {
    type: Boolean,
    default: false,
  }
},{timestamps:true});

export const Notification = model<INotification>('Notification', notificationSchema);