import { NextRequest, NextResponse } from 'next/server';

import { deleteBranchService } from '@/features/expansion/service/branch.service';
import { BranchIdSchema } from '@/features/expansion/validations/expansion.validation';
import { auth } from '@/shared/lib/auth';

type SessionUser = { id?: string };

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    const userId = (session?.user as SessionUser | undefined)?.id;
    if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

    const parsed = BranchIdSchema.safeParse((await params).id);
    if (!parsed.success) return NextResponse.json({ error: 'VALIDATION_ERROR' }, { status: 400 });

    const { data, status } = await deleteBranchService(userId, parsed.data);
    return NextResponse.json(data, { status });
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
