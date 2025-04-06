import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser, IUserFilterableFields } from './user.interface';
import { User } from './user.model';
import stripe from '../../../config/stripe';
import { IPaginationOptions } from '../../../types/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { userSearchableFields } from './user.constants';
import { Subscription } from '../subscription/subscription.model';
import { Booking } from '../booking/book.model';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  const isEmailExist = await User.findOne({
    email: payload.email,
    status: { $ne: 'delete' },
  });
  if (isEmailExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'An account with this email already exists, please try again with new email.'
    );
  }

  //set role
  payload.role = USER_ROLES.USER;
  const stripeCustomer = await stripe.customers.create({
    email: payload.email || '',
    name: payload.firstName || '',
    metadata: { role: payload.role ? payload.role.toString() : '' },
  });

  if (!stripeCustomer.id) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Something went wrong, please try again.'
    );
  }

  // Add Stripe Customer ID to the user payload
  payload.stripeCustomerId = stripeCustomer.id;
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.firstName,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

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

  const updateDoc = await User.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    {
      new: true,
    }
  );

  return updateDoc;
};

const getAllUserFromDB = async (
  filterOptions: IUserFilterableFields,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const { searchTerm, stationId, ...filters } = filterOptions;
  const andConditions: { [key: string]: any }[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filters).length) {
    andConditions.push(
      ...Object.entries(filters).map(([key, value]) => ({ [key]: value }))
    );
  }

  if (stationId) {
    const uniqueUsers = await Booking.distinct('userId', { stationId });
    andConditions.push({ _id: { $in: uniqueUsers } });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  // Parallelize main queries
  const [result, total, subscriptions] = await Promise.all([
    User.find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .lean(),
    User.countDocuments(whereConditions),
    Subscription.find({
      userId: {
        $in: andConditions.some(c => c._id?.$in)
          ? andConditions.find(c => c._id?.$in)?._id?.$in
          : undefined,
      },
    }).lean(),
  ]);

  // Create subscription map using reduce
  const subscriptionMap = subscriptions.reduce(
    (map, sub) => map.set(sub.userId.toString(), sub.plan_type),
    new Map()
  );

  // Transform results with map
  const resultWithSubscriptionType = result.map(user => ({
    ...user,
    subscriptionType:
      subscriptionMap.get(user._id.toString()) || 'not subscribed',
  }));

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: resultWithSubscriptionType,
  };
};

const getSubscribedPlanFromDB = async (user: JwtPayload) => {
  const subscription = await Subscription.findOne({
    userId: user.id,
    status: 'active',
  });
  if (!subscription) {
    return null;
  }
  //now find the bookings that falls in the current subscription start and end date
  const bookingCount = await Booking.countDocuments({
    userId: user.id,
    date: {
      $gte: subscription?.start_date,
      $lte: subscription?.end_date,
    },
  });

  return {
    subscription,
    bookingCount,
  };
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUserFromDB,
  getSubscribedPlanFromDB,
};
