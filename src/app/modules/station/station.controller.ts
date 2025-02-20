import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StationService } from './station.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createStation = catchAsync(async (req: Request, res: Response) => {
 let image = getSingleFilePath(req.files, 'image');
 let data = JSON.parse(req.body.data);
    const stationData = {
      image,
      ...data,
    };
  const result = await StationService.createStationToDB(stationData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Station created successfully',
    data: result,
  });
});

const getAllStations = catchAsync(async (req: Request, res: Response) => {
  const result = await StationService.getAllStationsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Stations fetched successfully',
    data: result,
  });
});

export const StationController = {
  createStation,
  getAllStations
};