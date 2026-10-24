import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/places/repository/place.repository', () => ({
  placeRepository: {
    findNear: vi.fn(),
  },
}));

import { placeRepository } from '@/features/places/repository/place.repository';
import { PLACE_CATEGORY_KEYS } from '@/shared/const/places.const';

import { getNearbyPlacesService } from './place.service';

const mockRepo = vi.mocked(placeRepository);

const fakeRow = {
  _id: { toString: () => '507f1f77bcf86cd799439011' },
  osmId: 'node/1',
  name: 'Coffee Lab',
  nameKa: '',
  category: 'cafe',
  location: { type: 'Point', coordinates: [44.75, 41.71] },
  source: 'osm',
  distanceM: 123.6,
};

describe('getNearbyPlacesService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps rows to NearbyPlace DTOs with rounded distance', async () => {
    mockRepo.findNear.mockResolvedValueOnce([fakeRow] as never);
    const result = await getNearbyPlacesService({ lng: 44.75, lat: 41.71, radiusM: 500, categories: ['cafe'] });
    expect(result.status).toBe(200);
    expect(result.data).toEqual([
      {
        id: '507f1f77bcf86cd799439011',
        osmId: 'node/1',
        name: 'Coffee Lab',
        nameKa: '',
        category: 'cafe',
        lng: 44.75,
        lat: 41.71,
        distanceM: 124,
      },
    ]);
  });

  it('queries every category with the default limit when none are given', async () => {
    mockRepo.findNear.mockResolvedValueOnce([]);
    await getNearbyPlacesService({ lng: 44.75, lat: 41.71, radiusM: 500 });
    expect(mockRepo.findNear).toHaveBeenCalledWith(
      expect.objectContaining({ categories: [...PLACE_CATEGORY_KEYS], limit: 500 })
    );
  });
});
