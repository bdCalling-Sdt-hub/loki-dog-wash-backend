import { z } from 'zod';

const saveStationZodSchema = z.object({
    params: z.object({
      stationId: z.string({
        required_error: 'Station ID is required',
      }).nonempty('Station ID cannot be empty'),
    }),
  });
  
  export const SaveValidation = {
    saveStationZodSchema
  };