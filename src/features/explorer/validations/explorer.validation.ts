import { z } from 'zod';

import { BUSINESS_TYPE_KEYS } from '@/shared/const/business-types.const';

/** Deep-link params, e.g. /explorer?lng=44.75&lat=41.71&type=cafe */
export const ExplorerSearchParamsSchema = z.object({
  lng: z.coerce.number().min(-180).max(180).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  type: z.enum(BUSINESS_TYPE_KEYS).optional(),
});

export type ExplorerSearchParamsType = z.infer<typeof ExplorerSearchParamsSchema>;
