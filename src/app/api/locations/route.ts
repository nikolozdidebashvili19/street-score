import { NextRequest, NextResponse } from 'next/server';

import { createLocationService, listLocationsService } from '@/features/locations/service/location.service';
import { CreateLocationSchema } from '@/features/locations/validations/location.validation';
import { auth } from '@/shared/lib/auth';
import { validateBody } from '@/shared/middleware/validate-body';

type SessionUser = { id?: string };

async function getUserId(): Promise<string | null> {
  const session = await auth();
  return (session?.user as SessionUser | undefined)?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const { data, status } = await listLocationsService(userId);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const validated = await validateBody(req, CreateLocationSchema);
    if (validated instanceof NextResponse) return validated;

    const { data, status } = await createLocationService(userId, validated.data);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
