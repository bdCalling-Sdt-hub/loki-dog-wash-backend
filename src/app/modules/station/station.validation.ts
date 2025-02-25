import { z } from 'zod';

const createStationZodSchema = z.object({
    body: z.object({
      data: z.string().refine(
        (val) => {
          try {
            const parsedData = JSON.parse(val);
            return true;
          } catch (error) {
            return false;
          }
        },
        {
          message: 'Invalid JSON data format'
        }
      ).transform(val => {
        const parsedData = JSON.parse(val);
        
        // Validate the parsed data structure
        const dataSchema = z.object({
          name: z.string({
            required_error: 'Station name is required',
          }).nonempty('Station name cannot be empty'),
          description: z.string({
            required_error: 'Description is required',
          }).nonempty('Description cannot be empty'),
          location: z.string({
            required_error: 'Location is required',
          }).nonempty('Location cannot be empty'),
          contact: z.string({
            required_error: 'Contact information is required',
          }).nonempty('Contact information cannot be empty'),
          slots: z.array(
            z.string({
              required_error: 'Slot is required',
            }).nonempty('Slot cannot be empty')
          ).nonempty('At least one slot is required'),
          // Review is optional in the model
          review: z.array(
            z.object({
              userId: z.string().nonempty('User ID is required'),
              name: z.string().nonempty('Name is required'),
              comment: z.string().nonempty('Comment is required'),
              rating: z.number()
                .min(1, 'Rating must be at least 1')
                .max(5, 'Rating cannot exceed 5'),
            })
          ).optional(),
        });
        
        return dataSchema.parse(parsedData);
      }),
    }),
  });
  
  export const StationValidation = {
    createStationZodSchema
  };