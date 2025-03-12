import { z } from "zod";

const askQuestionZodSchema = z.object({
  question: z.string().min(1).max(1000),
});

const replyToQuestionZodSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const communityValidation = {
  askQuestionZodSchema,
  replyToQuestionZodSchema,
};