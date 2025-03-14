import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { User } from '../user/user.model';
import { referEmailTemplate } from './refer.emailTemplate';
import { IRefer } from './refer.interface';
import { Refer } from './refer.model';
import { generateReferralCode } from '../../../util/generateRefCode';
import mongoose, { Types } from 'mongoose';
import { Subscription } from '../subscription/subscription.model';
import { sendNotification } from '../../../helpers/sendNotificationHelper';
import { JwtPayload } from 'jsonwebtoken';

const createRefer = async (
  email: string,
  userId: string,
  referralCode?: string
) => {
  try {

    const user = await User.findById(userId).lean();
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Check if the email has already been referred
    const existingRefer = await Refer.findOne({ email });
    if (existingRefer) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This email has already been referred'
      );
    }

    // Generate a referral code if not provided
    if (!referralCode) {
      referralCode = generateReferralCode();
    }

    // Create the referral record
    const referData: IRefer = {
      email,
      referredBy: new Types.ObjectId(userId),
      referralCode,
      isVerified: false,
    };

    // Save the referral record
    await Refer.create([referData]);


    await emailHelper.sendEmail(
      referEmailTemplate.userConfirmation({
        referralCode,
        email,
        referredBy: `${user.firstName} ${user.lastName}`,
      })
    );

    return {
      success: true,
      message: 'Referral sent successfully',
      referralCount: user.referCount! + 1, 
    };
  } catch (error) {

    throw error;
  }
};


const verifyRefer = async (referralCode: string, user: JwtPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the requested user and the referral in parallel
    const [requestedUser, refer] = await Promise.all([
      User.findById(user._id).lean().session(session),
      Refer.findOne({ referralCode, isVerified: false }).session(session),
    ]);

    // Validate the requested user
    if (!requestedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Validate the referral
    if (!refer) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid referral code');
    }

    // Mark the referral as verified and increment the referrer's count in parallel
    const [markVerifiedResult, updateUserReferCountResult] = await Promise.all([
      Refer.updateOne(
        { referralCode },
        { $set: { isVerified: true } },
        { session }
      ),
      User.updateOne(
        { _id: refer.referredBy },
        { $inc: { referCount: 1 } },
        { session }
      ),
    ]);

    // Check if the updates were successful
    if (!markVerifiedResult.modifiedCount || !updateUserReferCountResult.modifiedCount) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to verify referral, please try again');
    }

    // Fetch the referred user
    const referredUser = await User.findById(refer.referredBy).lean().session(session);
    if (!referredUser || referredUser.status === 'delete') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Referred user not found');
    }

    // Create a subscription if the referrer has reached 2 referrals
    if (referredUser.referCount === 2) {
      await Subscription.create(
        [
          {
            userId: refer.referredBy,
            plan_type: 'Monthly',
            start_date: new Date(),
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'active',
            stripe_subscription_id: 'referred',
            amount: 0,
            type: 'referred',
          },
        ],
        { session }
      );
    }

    // Send notification
    await sendNotification(
      'notification',
      user._id.toString(),
      {
        title:
          referredUser.referCount === 2
            ? `${referredUser.firstName} ${referredUser.lastName}, congratulations! Your two referrals have been verified.`
            : `${requestedUser.firstName} ${requestedUser.lastName} has verified your referral.`,
        message:
          referredUser.referCount === 2
            ? 'Congratulations! Your two referrals have been verified, and you have been subscribed. Enjoy your 1-month free subscription.'
            : `${requestedUser.firstName} ${requestedUser.lastName} has verified your referral. Refer one more to get 1-month free subscription.`,
      }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Referral verified successfully' };
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();

    // Re-throw the error for further handling
    throw error;
  }
};
export const ReferService = {
  createRefer,
  verifyRefer,
};
