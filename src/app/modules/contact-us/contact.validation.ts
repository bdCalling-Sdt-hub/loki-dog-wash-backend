import { z } from 'zod';

const createContactZodSchema = z.object({
  body: z.object({
    message: z.string({
      required_error: 'Message is required',
    }),
  }),
});

export const ContactValidation = {
  createContactZodSchema,
};
