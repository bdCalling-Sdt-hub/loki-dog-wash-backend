import {z} from 'zod';
const createPackageZodSchema = z.object({
    body: z.object({
      title: z.string({
        required_error: 'Title is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }),
      content: z.array(z.string({
        required_error: 'Content is required',
      })).min(1),
      price: z.number({
        required_error: 'Price is required',
      }).positive('Price must be a positive number'),
      duration: z.string().optional(),
      paymentType: z.enum(['Monthly', 'Yearly','Single'], {
        required_error: 'Payment type is required',
        invalid_type_error: 'Payment type must be either "Monthly" or "Yearly"',
      }).optional(),
      paymentLink: z.string().optional(),
      status: z.enum(['Active', 'Delete']).default('Active').optional(),
      productId: z.string().optional(),
      priceId: z.string().optional(),
    }),
  });
  
  const updatePackageZodSchema = z.object({
    body: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      content: z.array(z.string()).min(1).optional(),
      price: z.number().positive('Price must be a positive number').optional(),
      duration: z.enum(['1 month', '1 year']).optional(),
      paymentType: z.enum(['Monthly', 'Yearly']).optional(),
      paymentLink: z.string().optional(),
      status: z.enum(['Active', 'Delete']).optional(),
      productId: z.string().optional(),
      priceId: z.string().optional(),
    }),
    params: z.object({
      id: z.string({
        required_error: 'Package ID is required',
      }),
    }),
  });
  
  const deletePackageZodSchema = z.object({
    params: z.object({
      id: z.string({
        required_error: 'Package ID is required',
      }),
    }),
  });
  
  const getSinglePackageZodSchema = z.object({
    params: z.object({
      id: z.string({
        required_error: 'Package ID is required',
      }),
    }),
  });
  
  export const PackageValidation = {
    createPackageZodSchema,
    updatePackageZodSchema,
    deletePackageZodSchema,
    getSinglePackageZodSchema,
  };