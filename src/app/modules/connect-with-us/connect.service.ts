import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Connect } from './connect.model';
import { IConnect } from './connect.interface.';

const createConnectWithUsToDB = async (payload: IConnect): Promise<IConnect> => {
  const result = await Connect.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create connect with us');
  }
  return result;
};

const getConnectWithUsFromDB = async (): Promise<IConnect[]> => {
  const result = await Connect.find({});
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get connect with us');
  }
  return result;
};

const updateConnectWithUsToDB = async (id: string, payload: IConnect): Promise<IConnect> => {
  const result = await Connect.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update connect with us');
  }
  return result;
};

const deleteConnectWithUsToDB = async(id:string)=>{
  const result = await Connect.findByIdAndDelete(id);
  if(!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong, please try again.");
  }

  return "Deleted successfully."
}

export const ConnectWithUsService = {
  createConnectWithUsToDB,
  getConnectWithUsFromDB,
  updateConnectWithUsToDB,
  deleteConnectWithUsToDB
};