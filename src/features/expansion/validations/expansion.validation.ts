import { z } from 'zod';

import { CoordinatesSchema } from '@/features/places/validations/place.validation';
import { BUSINESS_TYPE_KEYS } from '@/shared/const/business-types.const';
import { MAX_NEW_BRANCHES, MIN_NEW_BRANCHES } from '@/shared/const/expansion.const';
import { MAX_RADIUS_M, MIN_RADIUS_M } from '@/shared/const/places.const';

export const CreateBranchSchema = CoordinatesSchema.extend({
  label: z.string().trim().min(1).max(80),
  address: z.string().trim().max(300).default(''),
});

export type CreateBranchType = z.infer<typeof CreateBranchSchema>;

export const BranchIdSchema = z.string().min(24).max(24);

export const ExpansionPlanRequestSchema = z.object({
  businessType: z.enum(BUSINESS_TYPE_KEYS),
  radiusM: z.number().int().min(MIN_RADIUS_M).max(MAX_RADIUS_M),
  count: z.number().int().min(MIN_NEW_BRANCHES).max(MAX_NEW_BRANCHES),
});

export type ExpansionPlanRequestType = z.infer<typeof ExpansionPlanRequestSchema>;
