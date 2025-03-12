import { z } from 'zod';

const createConnectWithUsZodSchema = z.object({

    title: z
      .string({
        required_error: 'Title is required',
      }),

    link: z
      .string({
        required_error: 'Link is required',
      })
});


const updateConnectWithUsZodSchema = z.object({
  title:z.string().optional(),
  link:z.string().optional()
})

export const ConnectWithUsValidation = {
  createConnectWithUsZodSchema,
  updateConnectWithUsZodSchema
};
