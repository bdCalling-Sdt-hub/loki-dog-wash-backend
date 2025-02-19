import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import ApiError from '../../../errors/ApiError';

const createAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await AdminService.createAdminToDB(adminData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin created successfully',
      data: result,
    });
  }
);

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdminFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin retrieved successfully',
    data: result,
  });
});

const updateAdminBySuperAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await AdminService.updateAdminBySuperAdminToDB(
      adminId,
      data
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin updated successfully',
      data: result,
    });
  }
);

const deleteAdminBySuperAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await AdminService.deleteAdminBySuperAdminToDB(adminId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin deleted successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AdminService.getUserProfileFromDB(user);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await AdminService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);



export const AdminController = {
  createAdmin,
  getAllAdmin,
  updateAdminBySuperAdmin,
  getUserProfile,
  updateProfile,
  deleteAdminBySuperAdmin
};
