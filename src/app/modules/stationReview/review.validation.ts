import { z } from 'zod';

const createReviewZodSchema = z.object({
    body: z.object({
      comment: z.string({
        required_error: 'Comment is required',
      }).nonempty('Comment cannot be empty'),
      rating: z.number({
        required_error: 'Rating is required',
      }).min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    }),
    params: z.object({
      stationId: z.string({
        required_error: 'Station ID is required',
      }).nonempty('Station ID cannot be empty'),
    }),
  });
  
  // Validation schema for getting reviews by stationId
  const getReviewByStationIdZodSchema = z.object({
    params: z.object({
      stationId: z.string({
        required_error: 'Station ID is required',
      }).nonempty('Station ID cannot be empty'),
    }),
  });
  
  export const ReviewValidation = {
    createReviewZodSchema,
    getReviewByStationIdZodSchema,
  };