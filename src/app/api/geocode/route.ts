import { NextRequest, NextResponse } from 'next/server';

import { geocodeService } from '@/features/geocoding/service/geocoding.service';
import { GeocodeSchema } from '@/features/geocoding/validations/geocoding.validation';
import { validateBody } from '@/shared/middleware/validate-body';

export async function POST(req: NextRequest) {
  try {
    const validated = await validateBody(req, GeocodeSchema);
    if (validated instanceof NextResponse) return validated;

    const { data, status } = await geocodeService(validated.data);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
