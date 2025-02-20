import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IStation } from './station.interface';
import { Station } from './station.model';

const createStationToDB = async (payload: IStation): Promise<IStation | null> => {
  const result = await Station.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create station!');
  }
  return result;
};

const getAllStationsFromDB = async (): Promise<IStation[] | null> => {
  const result = await Station.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to fetch stations!');
  }
  return result;
};

export const StationService = {
  createStationToDB,
  getAllStationsFromDB
};