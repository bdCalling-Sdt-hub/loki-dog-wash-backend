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
import { Station } from '../station/station.model';
import { monthNames } from './admin.utils';

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
  paginationOptions: IPaginationOptions,
  filters: {
    searchTerm?: string;
    stationId?: string;
    status?: string;
    role?: string;
  }
): Promise<any> => {
  // Calculate pagination
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const { searchTerm, stationId, status, role } = filters;

  const andConditions = [];

  if (searchTerm) {
    ['name', 'email', 'contactNo'].map(field => {
      andConditions.push({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      });
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  if (stationId) {
    //get user with booking history
    const userIds = await Booking.distinct('userId', {
      stationId: stationId,
    });
    andConditions.push({
      _id: { $in: userIds },
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  andConditions.push({
    role: role,
  });
  // Get users with pagination
  const result = await User.find(whereConditions, {
    stripe_account_id: 0,
    stripeCustomerId: 0,
  })
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
    },
  };
  return data;
};

//dashboard api's

const getGeneralStats = async (stationId?: string, year?: string) => {
  const currentYear = new Date().getFullYear();
  const yearToUse = Number(year) || currentYear;
  const startDate = new Date(yearToUse, 0, 1); // Jan 1st
  const endDate = new Date(yearToUse, 11, 31); // Dec 31st

  // Base filter for all queries
  const baseFilter = {
    ...(stationId && { stationId }),
    date: { $gte: startDate, $lte: endDate },
  };

  // Get unique users in single query
  const userIds = await Booking.distinct('userId', baseFilter);

  // Parallelize independent queries
  const [totalUser, totalOrders, subscriptions] = await Promise.all([
    // User count logic
    stationId ? userIds.length : User.countDocuments(),

    // Total orders
    Booking.countDocuments(baseFilter),

    // Subscriptions data
    Subscription.find({
      userId: { $in: userIds },
      start_date: { $lte: endDate },
      end_date: { $gte: startDate },
    }),
  ]);

  // Active subscribers with single query
  const activeSubscriberCount = await Subscription.countDocuments({
    userId: { $in: userIds },
    status: 'active',
    start_date: { $lte: new Date() },
    end_date: { $gte: new Date() },
  });

  // Calculate revenue using aggregation
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

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

async function getYearlySubscriptionDataInMonthlyFormat(
  stationId?: string,
  year?: number
): Promise<MonthlySubscriptionData> {
  const currentYear = new Date().getFullYear();
  const yearToUse = year || currentYear;
  const startDate = new Date(yearToUse, 0, 1);
  const endDate = new Date(yearToUse, 11, 31);

  // Initialize monthly data with zeros
  const monthlyData = monthNames.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {} as MonthlySubscriptionData);

  // Build base query
  const subscriptionFilter: any = {
    start_date: { $gte: startDate, $lte: endDate },
  };

  if (stationId) {
    const userFilter = {
      stationId,
      date: { $gte: startDate, $lte: endDate },
    };
    const userIds = await Booking.distinct('userId', userFilter);
    subscriptionFilter.userId = { $in: userIds };
  }

  // Single query for subscriptions
  const subscriptions = await Subscription.find(subscriptionFilter).exec();

  // Aggregate amounts
  subscriptions.forEach(({ start_date, amount }) => {
    const monthName = monthNames[start_date.getMonth()];
    monthlyData[monthName] += amount;
  });

  return monthlyData;
}

const getStationsForDashboard = async () => {
  const stations = await Station.find().select({ _id: 1, name: 1 });
  return stations;
};

export const AdminService = {
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsersFromDB,
  getGeneralStats,
  getYearlySubscriptionDataInMonthlyFormat,
  getStationsForDashboard,
};
