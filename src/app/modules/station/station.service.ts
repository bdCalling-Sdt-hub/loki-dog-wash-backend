import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IStation } from './station.interface';
import { Station } from './station.model';
import { Types } from 'mongoose';
import { Booking } from '../booking/book.model';
import { SlotAvailability } from '../../../types/slots';
import { format, parse } from 'date-fns';
import { parseDateInUTC } from '../booking/booking.utils';
import { generateTimeCode, processSlots } from './station.utils';

const createStationToDB = async (
  payload: IStation
): Promise<IStation | null> => {
  //@ts-ignore
  payload.slots = processSlots(payload.slots);
  console.log(payload.slots);
  const result = await Station.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create station!');
  }
  return result;
};

const getAllStationsFromDB = async (): Promise<IStation[] | null> => {
  const result = await Station.find().lean();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to fetch stations!');
  }
  return result;
};

const getSingleStation = async (id: string) => {
  const result = await Station.findById(id).lean();

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'The requested station does not exist.'
    );
  }

  return result;
};

const updateStation = async (id: string, payload: Partial<IStation>) => {
  const result = await Station.findByIdAndUpdate(id, payload, {
    new: true,
  }).lean();
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update station!');
  }
  return result;
};

const getStationSlotsWithAvailability = async (
  stationId: string,
  dateString?: string
) => {
  try {
    // Parse the date string or use the current date
    const date = dateString
      ? parseDateInUTC(dateString, 'dd/MM/yyyy')
      : new Date();
    date.setUTCHours(0, 0, 0, 0); // Set to start of the day in UTC
    // Find the station
    const station = await Station.findById(stationId).lean();
    if (!station) {
      throw new Error('Station not found');
    }
    // Fetch bookings for the given date
    const bookings = await Booking.find({
      stationId: new Types.ObjectId(stationId),
      date: { $gte: date, $lt: new Date(date.getTime() + 86400000) }, // 24*60*60*1000
    }).lean();
    const bookedSlots = new Set(
      bookings.map(booking => {
        return booking.timeCode;
      })
    );

    const requestHour = new Date().getHours();
    const requestedHourIn12 = requestHour % 12 || 12; // Convert to 12-hour format
    const requestMinute = new Date().getMinutes();
    const amPm = requestHour >= 12 ? 'pm' : 'am';
    const slotTime = `${requestedHourIn12 + 1}.${requestMinute} ${amPm}`;
    const oneHourAheadTimeCode = generateTimeCode(slotTime);

    return station.slots.map(slot => {
      const isBooked = bookedSlots.has(slot.timeCode);
      const restricted = slot.timeCode > Number(oneHourAheadTimeCode);
      return {
        slot: slot.slot,
        timeCode: slot.timeCode,
        availability: !isBooked && !restricted,
      };
    });
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
  getStationSlotsWithAvailability,
};
