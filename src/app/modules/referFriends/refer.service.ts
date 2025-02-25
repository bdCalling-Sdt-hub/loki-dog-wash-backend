import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { User } from '../user/user.model';
import { referEmailTemplate } from './refer.emailTemplate';
import { IRefer } from './refer.interface';
import { Refer } from './refer.model';

const createRefer = async (
  email: string,
  userId: string,
  referralCode: string
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (user.referCount === undefined || user.referCount === null) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Refer Count field not found');
      }
    if (user.referCount >= 2) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'You have already referred the maximum number of friends'
      );
    }
    const existingRefer = await Refer.findOne({ email });
    if (existingRefer) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'This email has already been referred'
      );
    }

    //const referralCode = generateReferralCode();

    const referData: IRefer = {
      email,
      referredBy: userId,
      referralCode,
    };

    // Send confirmation email to the referred friend
    await emailHelper.sendEmail(
      referEmailTemplate.userConfirmation({
        referralCode,
        email,
      })
    );

    // Send notification email to the referring user
    /*await emailHelper.sendEmail(
      referEmailTemplate.referredFriendNotification({
        referralCode,
        email,
        referredBy: `${user.firstName} ${user.lastName}`,
        referredByEmail: user.email,
      })
    );*/

    await Refer.create(referData);

    user.referCount += 1;
    await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { referCount: 1 } },
      { new: true }
    );

    // Check if user has reached 2 referrals to give reward
    /*if (user.referCount >= 2) {
      // Here you would implement the reward logic
      // For example, add a free month of membership
      // This could be another field in the user model
    }*/

    return {
      success: true,
      message: 'Referral sent successfully',
      referralCount: user.referCount,
    };
  } catch (error) {
    throw error;
  }
};
export const ReferService = {
  createRefer,
};
