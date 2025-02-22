import { Model } from 'mongoose';

export type INotification = {
    type: 'QUESTION_REPLY';
    message: string;
    questionId: string;
    userId: string;
    replyUserId: string;
    read: boolean;
    createdAt: Date;
  }
export type NotificationModel = Model<INotification, Record<string, unknown>>;
