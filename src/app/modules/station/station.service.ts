import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IStation } from './station.interface';
import { Station } from './station.model';
import { Types } from 'mongoose';
import { Booking } from '../booking/book.model';
import { SlotAvailability } from '../../../types/slots';
import { format, parse } from 'date-fns';
import { parseDateInUTC } from '../booking/booking.utils';

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





const getStationSlotsWithAvailability = async (
  stationId: string,
  dateString?: string
): Promise<SlotAvailability[]> => {
  try {
    // Parse the date string or use the current date
    const date = dateString
      ? parseDateInUTC(dateString, 'dd/MM/yyyy')
      : new Date();
    date.setUTCHours(0, 0, 0, 0); // Set to start of the day in UTC

    // Find the station
    const station = await Station.findById(stationId).exec();
    if (!station) {
      throw new Error('Station not found');
    }

    // Fetch bookings for the given date
    const bookings = await Booking.find({
      stationId: new Types.ObjectId(stationId),
      date: { $gte: date, $lt: new Date(date.getTime() + 86400000) }, // 24*60*60*1000
    }).exec();


    const bookedSlots = new Set(
      bookings.map(booking => {

        const localDateString = format(new Date(booking.date), 'yyyy-MM-dd hh:mm a');
        const slots = localDateString.split(" ");
        const removedZero = `${slots[1].startsWith('0') ? slots[1].slice(1) : slots[1]}`;
        const formattedSlot = `${removedZero.replace(":", ".")} ${slots[2].toLowerCase()}`;
        return formattedSlot;
      })
    );

    // Map station slots to check availability
    return station.slots.map(slot => ({
      slot,
      availability: !bookedSlots.has(slot.toLowerCase()), // Check if the slot is booked
    }));
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

export const StationService = {
  createStationToDB,
  getAllStationsFromDB,
  getSingleStation,
  updateStation,
  getStationSlotsWithAvailability
};