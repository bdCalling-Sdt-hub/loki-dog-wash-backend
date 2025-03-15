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

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  payload.role = USER_ROLES.USER;
  const stripeCustomer = await stripe.customers.create({
    email: payload.email || '',
    name: payload.firstName || '',
    metadata: { role: payload.role ? payload.role.toString() : '' },
  });

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

  const updateDoc = await User.findOneAndUpdate({ _id: id }, {$set: payload}, {
    new: true,
  });

  return updateDoc;
};


const getAllUserFromDB = async (filterOptions: IUserFilterableFields, paginationOptions: IPaginationOptions) => {

  const {page, limit, skip, sortBy, sortOrder} = paginationHelper.calculatePagination(paginationOptions);

  const {searchTerm, ...filters} = filterOptions;

  const andConditions: { [key: string]: any }[] = [];

  if (searchTerm) {
    userSearchableFields.forEach(field => {
      andConditions.push({ [field]: { $regex: searchTerm, $options: 'i' } });
    });
  }

  if(Object.keys(filters).length) {
   Object.entries(filters).forEach(([key, value]) => {
    andConditions.push({ [key]: value });
   });
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions).skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).lean();

  const userIds = result.map(user => user._id); // Extract all user IDs

  // Fetch all subscriptions for the users in a single query
  const subscriptions = await Subscription.find({ userId: { $in: userIds } }).lean();
  
  // Create a map for quick lookup of subscriptions by userId
  const subscriptionMap = new Map();
  subscriptions.forEach(sub => {
    subscriptionMap.set(sub.userId.toString(), sub.plan_type);
  });
  
  // Map the subscription type to each user and add the `subscription Type` field
  const resultWithSubscriptionType = result.map(user => {
    return {
      ...user, // Spread the existing user properties
      subscriptionType: subscriptionMap.get(user._id.toString()) || "not subscribed", // Add the new field
    };
  });


  const total = await User.countDocuments(whereConditions);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No user found!');
  }
  return {
    data: resultWithSubscriptionType,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};


export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUserFromDB
};
