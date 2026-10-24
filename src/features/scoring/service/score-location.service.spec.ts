import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/places/repository/place.repository', () => ({
  placeRepository: {
    countByCategoryNear: vi.fn(),
  },
}));

import { placeRepository } from '@/features/places/repository/place.repository';

import { scoreLocationService } from './score-location.service';

const mockRepo = vi.mocked(placeRepository);

describe('scoreLocationService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('scores a location from category counts in the radius', async () => {
    mockRepo.countByCategoryNear.mockResolvedValueOnce([
      { _id: 'cafe', count: 3 },
      { _id: 'office', count: 12 },
      { _id: 'bus_stop', count: 6 },
    ]);

    const result = await scoreLocationService({ lng: 44.79, lat: 41.71, radiusM: 500, businessType: 'cafe' });

    expect(result.status).toBe(200);
    expect(mockRepo.countByCategoryNear).toHaveBeenCalledWith({ lng: 44.79, lat: 41.71, radiusM: 500 });
    const data = result.data as { score: { total: number; coverage: number }; counts: Record<string, number> };
    expect(data.counts).toEqual({ cafe: 3, office: 12, bus_stop: 6 });
    expect(data.score.coverage).toBe(80);
    expect(typeof data.score.total).toBe('number');
  });

  it('includes rent when rent and budget are provided', async () => {
    mockRepo.countByCategoryNear.mockResolvedValueOnce([]);
    const result = await scoreLocationService({
      lng: 44.79,
      lat: 41.71,
      radiusM: 500,
      businessType: 'cafe',
      rentGel: 2000,
      budgetGel: 2500,
    });
    const data = result.data as { score: { factors: { key: string; value: number | null }[] } };
    expect(data.score.factors.find((factor) => factor.key === 'rent')?.value).toBe(100);
  });
});
