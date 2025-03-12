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

const getSingleStation = async(id:string)=>{
  const result = await Station.findById(id).lean();

  if(!result){
    throw new ApiError(StatusCodes.BAD_REQUEST, "The requested station does not exist.")
  }

  return result;
}


const updateStation = async(id:string, payload:Partial<IStation>) =>{
  const result = await Station.findByIdAndUpdate(id, payload, { new: true }).lean();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update station!');
  }
  return result;
}

export const StationService = {
  createStationToDB,
  getAllStationsFromDB,
  getSingleStation,
  updateStation
};