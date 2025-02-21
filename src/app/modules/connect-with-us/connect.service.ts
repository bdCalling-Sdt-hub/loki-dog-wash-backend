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

export const ConnectWithUsService = {
  createConnectWithUsToDB,
  getConnectWithUsFromDB,
};