import { Model, Types } from 'mongoose';

export type INotification = {
  _id:Types.ObjectId
    type: 'QUESTION_REPLY' | "ANNOUNCEMENT" | "REFERRAL" | "CONTACT";
    title: string;
    message: string;
    questionId?:Types.ObjectId
    receiverId?: Types.ObjectId;
    senderId?: Types.ObjectId;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
export type NotificationModel = Model<INotification, Record<string, unknown>>;
