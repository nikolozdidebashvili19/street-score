import { z } from 'zod';

import { CoordinatesSchema } from '@/features/places/validations/place.validation';
import { BUSINESS_TYPE_KEYS } from '@/shared/const/business-types.const';
import { MAX_COMPARE_LOCATIONS } from '@/shared/const/locations.const';
import { MAX_RADIUS_M, MIN_RADIUS_M } from '@/shared/const/places.const';

export const CreateLocationSchema = CoordinatesSchema.extend({
  label: z.string().trim().min(1).max(80),
  address: z.string().trim().max(300).default(''),
  businessType: z.enum(BUSINESS_TYPE_KEYS),
  radiusM: z.number().int().min(MIN_RADIUS_M).max(MAX_RADIUS_M),
  rentGel: z.number().positive().max(1_000_000).nullish(),
  budgetGel: z.number().positive().max(1_000_000).nullish(),
});

export type CreateLocationType = z.infer<typeof CreateLocationSchema>;

/** Form-side schema: inputs arrive as strings and are coerced before submit. */
export const SaveLocationFormSchema = z.object({
  label: z.string().trim().min(1, 'labelRequired').max(80),
  rentGel: z.string().regex(/^\d*$/, 'wholeLari').optional(),
  budgetGel: z.string().regex(/^\d*$/, 'wholeLari').optional(),
});

export type SaveLocationFormType = z.infer<typeof SaveLocationFormSchema>;

export const LocationIdSchema = z.string().min(24).max(24);

/** /compare?ids=a,b,c — malformed ids are dropped, at most MAX_COMPARE_LOCATIONS kept. */
export const CompareSearchParamsSchema = z.object({
  ids: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .filter((id) => LocationIdSchema.safeParse(id).success)
        .slice(0, MAX_COMPARE_LOCATIONS)
    ),
});
