import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StationService } from './station.service';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';

const createStation = catchAsync(async (req: Request, res: Response) => {
 let image = getMultipleFilesPath(req.files, 'image');
 console.log(image)
    const stationData = {
      images:image,
      ...req.body,
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



const getSingleStation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StationService.getSingleStation(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Station fetched successfully',
    data: result,
  });
});


const updateStation = catchAsync(async(req:Request, res:Response)=>{
  let image = getMultipleFilesPath(req.files, 'image');
  console.log(image)

     const stationData = {
       images:image,
       ...req.body,
     };


   const result = await StationService.updateStation(req.params.id,stationData);
   sendResponse(res, {
     success: true,
     statusCode: StatusCodes.OK,
     message: 'Station updated successfully',
     data: result,
   });
})

export const StationController = {
  createStation,
  getAllStations,
  getSingleStation,
  updateStation
};