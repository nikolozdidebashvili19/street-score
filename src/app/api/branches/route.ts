import { NextRequest, NextResponse } from 'next/server';

import { createBranchService, listBranchesService } from '@/features/expansion/service/branch.service';
import { CreateBranchSchema } from '@/features/expansion/validations/expansion.validation';
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

    const { data, status } = await listBranchesService(userId);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const validated = await validateBody(req, CreateBranchSchema);
    if (validated instanceof NextResponse) return validated;

    const { data, status } = await createBranchService(userId, validated.data);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
