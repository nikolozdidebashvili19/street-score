import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('invalidEmail'),
  password: z.string().min(8, 'passwordMin').max(100),
});

export type LoginType = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
  fullName: z.string().min(2, 'nameMin').max(100),
  email: z.string().email('invalidEmail'),
  password: z.string().min(8, 'passwordMin').max(100),
});

export type SignUpType = z.infer<typeof SignUpSchema>;
