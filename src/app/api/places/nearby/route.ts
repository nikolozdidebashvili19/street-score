import { NextRequest, NextResponse } from 'next/server';

import { getNearbyPlacesService } from '@/features/places/service/place.service';
import { NearbyQuerySchema } from '@/features/places/validations/place.validation';
import { validateBody } from '@/shared/middleware/validate-body';

export async function POST(req: NextRequest) {
  try {
    const validated = await validateBody(req, NearbyQuerySchema);
    if (validated instanceof NextResponse) return validated;

    const { data, status } = await getNearbyPlacesService(validated.data);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
