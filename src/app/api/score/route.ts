import { NextRequest, NextResponse } from 'next/server';

import { scoreLocationService } from '@/features/scoring/service/score-location.service';
import { ScoreRequestSchema } from '@/features/scoring/validations/scoring.validation';
import { validateBody } from '@/shared/middleware/validate-body';

export async function POST(req: NextRequest) {
  try {
    const validated = await validateBody(req, ScoreRequestSchema);
    if (validated instanceof NextResponse) return validated;

    const { data, status } = await scoreLocationService(validated.data);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
