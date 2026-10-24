import { z } from 'zod';

import { MAX_RADIUS_M, MIN_RADIUS_M, PLACE_CATEGORY_KEYS } from '@/shared/const/places.const';

export const CoordinatesSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export const NearbyQuerySchema = CoordinatesSchema.extend({
  radiusM: z.number().int().min(MIN_RADIUS_M).max(MAX_RADIUS_M),
  categories: z.array(z.enum(PLACE_CATEGORY_KEYS)).min(1).optional(),
  limit: z.number().int().min(1).max(1000).optional(),
});

export type NearbyQueryType = z.infer<typeof NearbyQuerySchema>;
