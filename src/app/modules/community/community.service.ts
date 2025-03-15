import { ICommunity, ICommunityReply } from './community.interface';
import { Community } from './community.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { sendNotification } from '../../../helpers/sendNotificationHelper';

const askQuestion= async(user:JwtPayload, payload:Partial<ICommunity>): Promise<ICommunity> => {
  payload.userId = user.id;
  const question = await Community.create(payload);
  
  const populatedQuestion = await Community.findById(question._id)
    .populate('userId', 'firstName image')
    .populate('replies.userId', 'firstName image');

  if (!populatedQuestion) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create question');
  }

  // Emit to all connected users
  (global as any).io.emit('newQuestion', populatedQuestion);

  return populatedQuestion;
};


const replyToQuestion = async (
  user: JwtPayload,
  questionId: string,
  replyData: string
) => {
  const question = await Community.findById(questionId);

  if (!question) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Question not found');
  }

  const reply = {
    content: replyData,
    userId: user.id,
    createdAt: new Date(),
  };

  question.replies.push(reply);
  await question.save();

  const [isUserExist, populatedQuestion] = await Promise.all([
    User.findById(user.id),
    Community.findById(question._id)
      .populate<{ userId: { _id: Types.ObjectId; firstName: string; image: string } }>({
        path: 'userId',
        select: '_id firstName image',
      })
      .populate<{ replies: { userId: { _id: Types.ObjectId; firstName: string; image: string } }[] }>({
        path: 'replies.userId',
        select: '_id firstName image',
      }),
  ]);

  if (!isUserExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (!populatedQuestion) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to populate question');
  }

  const repliedUserIds = populatedQuestion.replies
    .map((reply) => reply.userId?._id?.toString())
    .filter(Boolean);
  const uniqueRepliedUserIds = [...new Set(repliedUserIds)];

  const questionOwnerId = populatedQuestion.userId._id.toString();




  const notificationPromises = uniqueRepliedUserIds.map(async (userId) => {
    console.log('Notification sent to user:', userId);
    try {
      await sendNotification('notification', userId, {
        receiverId: new Types.ObjectId(userId),
        senderId: new Types.ObjectId(user.id),
        type: 'QUESTION_REPLY',
        questionId: populatedQuestion._id,
        title: userId === questionOwnerId ? `${isUserExist.firstName} has replied to your question` : `${isUserExist.firstName} has replied to your response on ${populatedQuestion.userId.firstName}'s question`,
        message: replyData,
        read: false,
      });
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
    }
  });

  const socketEmitPromises = uniqueRepliedUserIds.map(async (userId) => {
    try {
      (global as any).io.emit(`newReply::${userId}`, {
        questionId: populatedQuestion._id,
        reply: populatedQuestion.replies[populatedQuestion.replies.length - 1],
      });
    } catch (error) {
      console.error(`Failed to emit socket event to user ${userId}:`, error);
    }
  });

  await Promise.all([...notificationPromises, ...socketEmitPromises]);

  return populatedQuestion;
};


const getQuestions = async () => {
  const questions = await Community.find().populate('userId', 'firstName image').populate('replies.userId', 'firstName image').sort({ createdAt: -1 });
  return questions;
};


const getQuestion = async (id: string) => {
  const question = await Community.findById(id).populate('userId', 'firstName image').populate('replies.userId', 'firstName image');
  return question;
};

  export const CommunityService = {
  askQuestion,
  replyToQuestion,
  getQuestions,
  getQuestion
};