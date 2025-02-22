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


export const AdminService = {
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsersFromDB
};
