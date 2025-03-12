import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SaveService } from './save.service';

const saveOrRemoveStation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const stationId = req.params.stationId;
  const result = await SaveService.saveOrRemoveStationToDB(userId, stationId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Station saved or removed successfully',
    data: result,
  });
});
const getAllSavedStation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  console.log(req.user)
  const result = await SaveService.getAllSavedStationFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All saved station retrieved successfully',
    data: result,
  });
});
export const SaveController = {
  saveOrRemoveStation,
  getAllSavedStation
};
