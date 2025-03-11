import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'firstName is required' }),
    lastName: z.string({ required_error: 'lastName is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    profile: z.string().optional(),
  }),
});

const updateUserZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  password: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
  stripe_account_id: z.string().optional(),
  profile: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
