import { ICommunity, ICommunityReply } from './community.interface';
import { Community } from './community.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { onlineUsers } from '../../../server';
import { Notification } from '../notification/notification.model';
import { INotification } from '../notification/notification.interface';

const askQuestion = async (payload: Partial<ICommunity>): Promise<ICommunity> => {
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
  questionId: string,
  replyData: ICommunityReply
): Promise<ICommunity> => {
  const question = await Community.findById(questionId);
  
  if (!question) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Question not found');
  }

  // Don't send notification if the reply user is the question user
  const shouldNotify = question.userId !== replyData.userId;

  question.replies.push(replyData);
  await question.save();

  const populatedQuestion = await Community.findById(questionId)
    .populate('userId', 'firstName image')
    .populate('replies.userId', 'firstName image');

  if (!populatedQuestion) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to add reply');
  }

  const newReply = populatedQuestion.replies[populatedQuestion.replies.length - 1];
  
  if (shouldNotify) {
    // Create notification
    const notification = await Notification.create({
      type: 'QUESTION_REPLY',
      message: `Someone replied to your question`,
      questionId: questionId,
      userId: question.userId,
      replyUserId: replyData.userId,
      read: false,
      createdAt: new Date(),
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate('userId', 'firstName image')
      .populate('replyUserId', 'firstName image');

      // Emit notification to question user if online
    const userSocketId = onlineUsers[question.userId];
    if (userSocketId) {
      (global as any).io.to(userSocketId).emit('newNotification', populatedNotification);
    }
}
  // Emit to question user if online
  const userSocketId = onlineUsers[question.userId];
  if (userSocketId) {
    (global as any).io.to(userSocketId).emit('newReply', {
      questionId,
      reply: populatedQuestion.replies[populatedQuestion.replies.length - 1],
    });
  }

  // Emit to all users viewing the question
  (global as any).io.to(`question_${questionId}`).emit('newReply', {
    questionId,
    reply: newReply,
  });

  // Also emit to all users viewing the question
  (global as any).io.to(`question_${questionId}`).emit('newReply', {
    questionId,
    reply: populatedQuestion.replies[populatedQuestion.replies.length - 1],
  });

  return populatedQuestion;
};

const getAllQuestions = async (): Promise<ICommunity[]> => {
  const questions = await Community.find()
    .populate('userId', 'firstName image')
    .populate('replies.userId', 'firstName image')
    .sort({ createdAt: -1 });

  return questions;
};

const getUserNotifications = async (userId: string): Promise<INotification[]> => {
    const notifications = await Notification.find({ userId })
      .populate('userId', 'firstName image')
      .populate('replyUserId', 'firstName image')
      .sort({ createdAt: -1 });
  
    return notifications;
  };

  const markNotificationAsRead = async (notificationId: string): Promise<INotification> => {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    )
      .populate('userId', 'firstName image')
      .populate('replyUserId', 'firstName image');
  
    if (!notification) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
    }
  
    return notification;
  };

export const CommunityService = {
  askQuestion,
  replyToQuestion,
  getAllQuestions,
  getUserNotifications,
  markNotificationAsRead
};