import { z } from 'zod';

const createReferZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    referralCode: z
      .string({
        required_error: 'Referral code is required',
      })
      .min(4, 'Referral code must be at least 4 characters')
      .max(20, 'Referral code must not exceed 20 characters'),
  }),
});

export const ReferValidation = {
  createReferZodSchema,
};
