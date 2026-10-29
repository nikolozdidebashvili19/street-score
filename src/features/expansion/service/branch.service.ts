import { branchRepository } from '@/features/expansion/repository/branch.repository';
import { type BranchDocument } from '@/features/expansion/schema/branch.schema';
import { type Branch } from '@/features/expansion/types/expansion.types';
import { type CreateBranchType } from '@/features/expansion/validations/expansion.validation';
import { MAX_BRANCHES } from '@/shared/const/expansion.const';
import { type ServiceResult } from '@/shared/types/common';

export function toBranch(doc: BranchDocument): Branch {
  const [lng, lat] = doc.location.coordinates;
  return {
    id: doc._id.toString(),
    label: doc.label,
    address: doc.address ?? '',
    lng,
    lat,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function createBranchService(userId: string, input: CreateBranchType): Promise<ServiceResult<Branch>> {
  const existing = await branchRepository.countByUser(userId);
  if (existing >= MAX_BRANCHES) return { data: { error: 'TOO_MANY_BRANCHES' }, status: 422 };

  const doc = await branchRepository.create({
    userId,
    label: input.label,
    address: input.address,
    location: { type: 'Point', coordinates: [input.lng, input.lat] },
  });
  return { data: toBranch(doc), status: 201 };
}

export async function listBranchesService(userId: string): Promise<ServiceResult<Branch[]>> {
  const docs = await branchRepository.findByUser(userId);
  return { data: docs.map(toBranch), status: 200 };
}

export async function deleteBranchService(userId: string, id: string): Promise<ServiceResult<{ message: string }>> {
  const deleted = await branchRepository.deleteByIdForUser(id, userId);
  if (!deleted) return { data: { error: 'NOT_FOUND' }, status: 404 };
  return { data: { message: 'Branch deleted' }, status: 200 };
}
