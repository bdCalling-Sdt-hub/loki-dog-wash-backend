import { object, z } from "zod";

const createAnnouncementZodSchema = z.object({
    body:z.object({
        title: z.string().min(3).max(100),
        message: z.string().min(3).max(1000),
        type: z.string().default("ANNOUNCEMENT"),
        senderId: z.string().min(3).max(1000),
    })
});


export const NotificationValidation = {
    createAnnouncementZodSchema
}