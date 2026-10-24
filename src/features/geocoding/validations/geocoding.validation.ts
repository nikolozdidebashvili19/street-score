import { z } from 'zod';

export const GeocodeSchema = z.object({
  query: z.string().trim().min(3, 'queryMin').max(200),
});

export type GeocodeType = z.infer<typeof GeocodeSchema>;
