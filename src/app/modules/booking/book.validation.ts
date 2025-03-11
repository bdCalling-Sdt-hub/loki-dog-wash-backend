import { z } from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is required' }).refine(
      val => {
        // Check if it follows the format: dd MMMM, yyyy (e.g., 25 February, 2025)
        return /^\d{1,2}\s[A-Za-z]+,\s\d{4}$/.test(val);
      },
      {
        message:
          'Date format should be: dd MMMM, yyyy (e.g., 25 February, 2025)',
      }
    ),

    time: z.string({ required_error: 'Time is required' }).refine(
      val => {
        // Check if it follows the format: h AM/PM or hh AM/PM (e.g., 3 PM, 11 AM)
        return /^(0?[1-9]|1[0-2])(\.([0-5]{1}[0-9]{1}))?\s(AM|PM|am|pm)$/.test(val);
      },
      { message: 'Time format should be: h AM/PM (e.g., 3.30 PM, 11.30 AM/am/pm)' }
    ),
  }),
  params: z.object({
    stationId: z.string({
      required_error: 'Station ID is required in params',
    }),
  }),
});
export const BookingValidation = {
  createBookingZodSchema,
};
