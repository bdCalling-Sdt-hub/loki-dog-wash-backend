import { StatusCodes } from 'http-status-codes';
import { About } from './about-us.model';
import { IAbout } from './about-us.interface';
import ApiError from '../../../errors/ApiError';

const createAboutToDB = async (payload: IAbout): Promise<IAbout> => {
  const result = await About.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create about');
  }
  return result;
};
const getAllAboutFromDB = async (): Promise<IAbout[]> => {
  const result = await About.find();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get about');
  }
  return result;
};

export const AboutService = {
  createAboutToDB,
  getAllAboutFromDB,
};