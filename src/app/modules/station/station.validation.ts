import { z } from 'zod';

const createStationZodSchema = z.object({
    name: z.string({ required_error: 'Name is required' }),
    description: z.string({ required_error: 'Description is required' }),
    location: z.string({ required_error: 'Location is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    slots: z.array(z.string({ required_error: 'Slot is required' })),
    capacity: z.number({ required_error: 'Capacity is required' }),
});
  
const updateStationZodSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  contact: z.string().optional(),
  slots: z.array(z.string()).optional(),
  capacity: z.number().optional(),
});


  export const StationValidation = {
    createStationZodSchema,
    updateStationZodSchema
  };