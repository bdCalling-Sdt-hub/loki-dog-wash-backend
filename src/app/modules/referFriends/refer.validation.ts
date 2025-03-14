import { z } from 'zod';

const createReferZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    referralCode: z
      .string().optional(),
  }),
});

export const ReferValidation = {
  createReferZodSchema,
};
