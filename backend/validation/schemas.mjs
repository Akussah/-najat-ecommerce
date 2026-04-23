import { z } from 'zod';

const lineItemSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
  price: z.coerce.number().min(0, 'Item price must be 0 or greater.'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.')
});

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  description: z.string().trim().min(1, 'Description is required.'),
  stock: z.string().trim().min(1, 'Stock status is required.').default('In stock'),
  bio: z.string().trim().optional().default(''),
  image: z.string().trim().optional().default('')
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('A valid email is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

export const signinSchema = z.object({
  email: z.string().trim().email('A valid email is required.'),
  password: z.string().min(1, 'Password is required.')
});

export const consultSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('A valid email is required.'),
  service: z.string().trim().min(1, 'Service is required.'),
  message: z.string().optional()
});

export const orderSchema = z.object({
  items: z.array(lineItemSchema).min(1, 'At least one item is required.'),
  address: z.string().trim().min(1, 'Address is required.'),
  paymentMethod: z.string().trim().min(1, 'Payment method is required.'),
  total: z.coerce.number().min(0.01, 'Total must be greater than 0.')
});

export const checkoutSchema = z.object({
  items: z.array(lineItemSchema).min(1, 'Items are required.'),
  fullName: z.string().trim().min(1, 'Full name is required.'),
  email: z.string().trim().email('A valid email is required.'),
  address: z.string().trim().min(1, 'Address is required.'),
  origin: z.string().trim().optional(),
  preferredChannel: z.string().trim().optional()
});
