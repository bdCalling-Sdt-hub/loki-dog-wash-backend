import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiError';
import { AdminService } from './admin.service';
import { USER_ROLES } from '../../../enums/user';

/*const createAdmin = catchAsync(
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
);*/

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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const role = USER_ROLES.USER;
  
  // Get pagination options from query parameters
  const paginationOptions = {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    sortBy: req.query.sortBy?.toString(),
    sortOrder: req.query.sortOrder?.toString() as 'asc' | 'desc'
  };

  const result = await AdminService.getAllUsersFromDB(role, paginationOptions);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: result
  });
});

const getGeneralStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getGeneralStats();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'General stats retrieved successfully',
    data: result
  });
});


const getYearlySubscriptionDataInMonthlyFormat = catchAsync(async (req: Request, res: Response) => {
  const year = Number(req.query.year);
  const result = await AdminService.getYearlySubscriptionDataInMonthlyFormat(year);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Yearly subscription data retrieved successfully',
    data: result
  });
});

export const AdminController = {
  getUserProfile,
  updateProfile,
  getAllUsers,
  getGeneralStats,
  getYearlySubscriptionDataInMonthlyFormat
};