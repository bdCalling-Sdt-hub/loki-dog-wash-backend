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


const verifyReferZodSchema = z.object({
  body: z.object({
    referralCode: z
      .string({
        required_error: 'Referral code is required',
      }),
  }),
});
export const ReferValidation = {
  createReferZodSchema,
  verifyReferZodSchema,
};
