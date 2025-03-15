import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../types/pagination';

import { Booking } from '../booking/book.model';
import { Subscription } from '../subscription/subscription.model';

/*const createAdminToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  payload.role = USER_ROLES.ADMIN;
  const createAdmin = await User.create(payload);
  if (!createAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createAdmin.name,
    otp: otp,
    email: createAdmin.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createAdmin._id },
    { $set: { authentication } }
  );

  return createAdmin;
};

const getAllAdminFromDB = async (): Promise<Partial<IUser>[]> => {
  const result = await User.find({ role: USER_ROLES.ADMIN });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No admin found!');
  }
  return result;
};

const updateAdminBySuperAdminToDB = async (
  adminId: string,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const isExistUser = await User.isExistUserById(adminId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  const updateDoc = await User.findOneAndUpdate({ _id: adminId }, payload, {
    new: true,
  });
  return updateDoc;
};

const deleteAdminBySuperAdminToDB = async (
  adminId: string
): Promise<Partial<IUser | null>> => {
  const isExistUser = await User.isExistUserById(adminId);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  const deleteDoc = await User.findOneAndDelete({ _id: adminId });
  return deleteDoc;
};*/

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUsersFromDB = async (
  role: string, 
  paginationOptions: IPaginationOptions
): Promise<any> => {
  // Calculate pagination
  const { page, limit, skip, sortBy, sortOrder } = 
    paginationHelper.calculatePagination(paginationOptions);

  // Get users with pagination
  const result = await User.find({ role: role })
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  if (!result.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No user found!');
  }

  // Get total count of users
  const total = await User.countDocuments({ role: role });

  const data = {
    result,
    meta: {
      page,
      limit,
      total,
    }
  }
  return data;
};



//dashboard api's

const getGeneralStats = async () => {
  const totalUser = await User.countDocuments();  // Ensure the count is awaited

  // Get active subscriber count
  const activeSubscriberCount = await Subscription.countDocuments({
    end_date: { $gte: new Date() },
    status: 'active',
  });

  const totalOrders = await Booking.countDocuments();  // Ensure the count is awaited

  // Calculate total revenue
  const totalRevenueResult = await Booking.aggregate([
    {
      $match: {
        date: { $lt: new Date() },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);

  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;  // Handle case when no revenue exists

  console.log(totalRevenue, activeSubscriberCount, totalOrders, totalUser);
  
  return {
    totalUser,
    activeSubscriberCount,
    totalOrders,
    totalRevenue,
  };
};




interface MonthlySubscriptionData {
  [key: string]: number; // Key will be the month (e.g., "January"), value will be the count or total amount
}

async function getYearlySubscriptionDataInMonthlyFormat(year?: number): Promise<MonthlySubscriptionData> {

  //if year is not provided, use current year
  const currentYear = new Date().getFullYear();
  const yearToUse = year || currentYear;

  const startDate = new Date(yearToUse, 0, 1); // Start of the year
  const endDate = new Date(yearToUse, 11, 31); // End of the year
  const subscriptions = await Subscription.find({
    start_date: { $gte: startDate, $lte: endDate },
  }).exec();

  const monthlyData: MonthlySubscriptionData = {};

  // Initialize monthlyData with all months set to 0
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthNames.forEach(month => {
    monthlyData[month] = 0;
  });

  subscriptions.forEach(subscription => {
    const month = subscription.start_date.getMonth(); // Get the month index (0-11)
    const monthName = monthNames[month];
    monthlyData[monthName] += subscription.amount; // Assuming you want to sum the amounts. Adjust logic if needed.
  });

  return monthlyData;
}




export const AdminService = {
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsersFromDB,
  getGeneralStats,
  getYearlySubscriptionDataInMonthlyFormat
};
