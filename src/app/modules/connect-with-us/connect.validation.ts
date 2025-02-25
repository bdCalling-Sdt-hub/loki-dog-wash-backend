import { z } from 'zod';

const createConnectWithUsZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      }),

    link: z
      .string({
        required_error: 'Link is required',
      })
  }),
});

export const ConnectWithUsValidation = {
  createConnectWithUsZodSchema,
};
