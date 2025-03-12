import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Save } from './save.model';
import { Types } from 'mongoose';

const saveOrRemoveStationToDB = async (userId: string, stationId: string) => {
  const result = await Save.findOne({stationId: stationId});
  if(!result) {
    const saved = await Save.create({userId: userId, stationId: stationId});
    return saved;
  }
  const removed = await Save.findOneAndDelete({stationId: stationId});
  return removed;
};


const getAllSavedStationFromDB = async (userId: string) => {
  const result = await Save.find({userId: new Types.ObjectId(userId)})
    .populate({
      path: 'stationId',
      select: 'name description location contact image slots review'
    });
  return result;
};
export const SaveService = {
  saveOrRemoveStationToDB,
  getAllSavedStationFromDB
};