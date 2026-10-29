import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/expansion/repository/branch.repository', () => ({
  branchRepository: {
    create: vi.fn(),
    findByUser: vi.fn(),
    countByUser: vi.fn(),
    deleteByIdForUser: vi.fn(),
  },
}));

import { branchRepository } from '@/features/expansion/repository/branch.repository';
import { MAX_BRANCHES } from '@/shared/const/expansion.const';

import { createBranchService, deleteBranchService, listBranchesService } from './branch.service';

const mockRepo = vi.mocked(branchRepository);

const USER_ID = '507f1f77bcf86cd799439011';

const fakeDoc = {
  _id: { toString: () => '65f000000000000000000002' },
  userId: USER_ID,
  label: 'Vake flagship',
  address: 'Chavchavadze Ave 37',
  location: { type: 'Point', coordinates: [44.75, 41.71] },
  createdAt: new Date('2026-10-23T10:00:00Z'),
};

const input = { label: 'Vake flagship', address: 'Chavchavadze Ave 37', lng: 44.75, lat: 41.71 };

describe('createBranchService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('stores a GeoJSON point for the session user', async () => {
    mockRepo.countByUser.mockResolvedValueOnce(0);
    mockRepo.create.mockResolvedValueOnce(fakeDoc as never);

    const result = await createBranchService(USER_ID, input);

    expect(result.status).toBe(201);
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER_ID, location: { type: 'Point', coordinates: [44.75, 41.71] } })
    );
    expect(result.data).toMatchObject({ id: '65f000000000000000000002', lng: 44.75, lat: 41.71 });
  });

  it('refuses to go past the branch limit', async () => {
    mockRepo.countByUser.mockResolvedValueOnce(MAX_BRANCHES);
    const result = await createBranchService(USER_ID, input);
    expect(result).toEqual({ data: { error: 'TOO_MANY_BRANCHES' }, status: 422 });
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});

describe('listBranchesService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('only queries the requesting user', async () => {
    mockRepo.findByUser.mockResolvedValueOnce([fakeDoc] as never);
    const result = await listBranchesService(USER_ID);
    expect(mockRepo.findByUser).toHaveBeenCalledWith(USER_ID);
    expect(result.data).toHaveLength(1);
  });
});

describe('deleteBranchService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 404 when nothing matched for this user', async () => {
    mockRepo.deleteByIdForUser.mockResolvedValueOnce(false);
    const result = await deleteBranchService(USER_ID, '65f000000000000000000002');
    expect(mockRepo.deleteByIdForUser).toHaveBeenCalledWith('65f000000000000000000002', USER_ID);
    expect(result.status).toBe(404);
  });
});
