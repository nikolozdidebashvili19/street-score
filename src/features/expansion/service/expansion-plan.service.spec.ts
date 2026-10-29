import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/expansion/repository/branch.repository', () => ({
  branchRepository: { findByUser: vi.fn() },
}));

vi.mock('@/features/places/repository/place.repository', () => ({
  placeRepository: { countByCategoryInGrid: vi.fn() },
}));

vi.mock('@/features/locations/repository/candidate-location.repository', () => ({
  candidateLocationRepository: { findByUser: vi.fn() },
}));

import { branchRepository } from '@/features/expansion/repository/branch.repository';
import { type ExpansionPlan } from '@/features/expansion/types/expansion.types';
import { candidateLocationRepository } from '@/features/locations/repository/candidate-location.repository';
import { placeRepository } from '@/features/places/repository/place.repository';

import { planExpansionService } from './expansion-plan.service';

const mockBranches = vi.mocked(branchRepository);
const mockPlaces = vi.mocked(placeRepository);
const mockSaved = vi.mocked(candidateLocationRepository);

const USER_ID = '507f1f77bcf86cd799439011';

const branchDoc = {
  _id: { toString: () => '65f000000000000000000002' },
  label: 'Vake flagship',
  address: '',
  location: { type: 'Point', coordinates: [44.75, 41.71] },
  createdAt: new Date('2026-10-23T10:00:00Z'),
};

const savedDoc = (id: string, businessType: string, coordinates: [number, number], total: number) => ({
  _id: { toString: () => id },
  label: `Saved ${id.slice(-1)}`,
  address: '',
  businessType,
  radiusM: 500,
  location: { type: 'Point', coordinates },
  rentGel: null,
  budgetGel: null,
  score: { total, coverage: 80, factors: [], counts: {}, computedAt: new Date() },
  createdAt: new Date('2026-10-23T10:00:00Z'),
});

describe('planExpansionService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('scopes every query to the user and only assesses saved sites of the same type', async () => {
    mockBranches.findByUser.mockResolvedValueOnce([branchDoc] as never);
    mockPlaces.countByCategoryInGrid.mockResolvedValueOnce([]);
    mockSaved.findByUser.mockResolvedValueOnce([
      savedDoc('65f000000000000000000003', 'cafe', [44.7501, 41.7101], 90),
      savedDoc('65f000000000000000000004', 'cafe', [44.8, 41.74], 70),
      savedDoc('65f000000000000000000005', 'gym', [44.78, 41.73], 99),
    ] as never);

    const result = await planExpansionService(USER_ID, { businessType: 'cafe', radiusM: 500, count: 3 });
    const plan = result.data as ExpansionPlan;

    expect(result.status).toBe(200);
    expect(mockBranches.findByUser).toHaveBeenCalledWith(USER_ID);
    expect(mockSaved.findByUser).toHaveBeenCalledWith(USER_ID);
    expect(plan.shortlist.map((item) => item.id)).toEqual(['65f000000000000000000004', '65f000000000000000000003']);
    // The saved site next door to the flagship is almost entirely cannibalised.
    expect(plan.shortlist[1].overlap).toBeGreaterThan(90);
    expect(plan.sites).toEqual([]);
    expect(plan.branches[0]).toMatchObject({ id: '65f000000000000000000002', overlap: 0, fit: null });
  });
});
