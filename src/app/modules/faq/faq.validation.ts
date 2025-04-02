import { z } from 'zod';

const createOrUpdateOthersZodSchema = z.object({
    body: z.object({
        content: z.string({ required_error: 'Content is required' }),
        type: z.string({ required_error: 'Type is required' })
    })
});

const getOthersZodSchema = z.object({
    params: z.object({
        type: z.string({ required_error: 'Type is required' })
    })
});

const addQuestionAndAnswerZodSchema = z.object({
    body: z.object({
        question: z.string({ required_error: 'Question is required' }),
        answer: z.string({ required_error: 'Answer is required' })
    })
});

const removeQuestionAndAnswerZodSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'ID is required' })
    })
});

const updateQuestionAndAnswerZodSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'ID is required' })
    }),
    body: z.object({
        question: z.string({ required_error: 'Question is required' }).optional(),
        answer: z.string({ required_error: 'Answer is required' }).optional()
    })
});

export const FaqValidation = {
    createOrUpdateOthersZodSchema,
    getOthersZodSchema,
    addQuestionAndAnswerZodSchema,
    removeQuestionAndAnswerZodSchema,
    updateQuestionAndAnswerZodSchema
};