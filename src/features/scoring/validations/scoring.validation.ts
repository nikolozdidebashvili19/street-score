import { z } from 'zod';

import { CoordinatesSchema } from '@/features/places/validations/place.validation';
import { BUSINESS_TYPE_KEYS } from '@/shared/const/business-types.const';
import { MAX_RADIUS_M, MIN_RADIUS_M } from '@/shared/const/places.const';
import { VISIBILITY_SCALE_MAX } from '@/shared/const/scoring.const';

export const ScoreRequestSchema = CoordinatesSchema.extend({
  businessType: z.enum(BUSINESS_TYPE_KEYS),
  radiusM: z.number().int().min(MIN_RADIUS_M).max(MAX_RADIUS_M),
  rentGel: z.number().positive().max(1_000_000).nullish(),
  budgetGel: z.number().positive().max(1_000_000).nullish(),
  pedestrianPer15Min: z.number().int().min(0).max(10_000).nullish(),
  visibility: z.number().int().min(1).max(VISIBILITY_SCALE_MAX).nullish(),
});

export type ScoreRequestType = z.infer<typeof ScoreRequestSchema>;
