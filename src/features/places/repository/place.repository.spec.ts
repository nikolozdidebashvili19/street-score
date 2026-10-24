import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/lib/mongo', () => ({
  mongo: {
    connect: vi.fn(),
  },
}));

vi.mock('@/features/places/schema/place.schema', () => ({
  PlaceModel: {
    aggregate: vi.fn(),
    bulkWrite: vi.fn(),
    syncIndexes: vi.fn(),
  },
}));

import { PlaceModel } from '@/features/places/schema/place.schema';
import { mongo } from '@/shared/lib/mongo';

import { placeRepository } from './place.repository';

const mockMongo = vi.mocked(mongo);
const mockModel = vi.mocked(PlaceModel);

describe('placeRepository', () => {
  beforeEach(() => vi.clearAllMocks());

  it('findNear runs a $geoNear pipeline with distance, radius and category filter', async () => {
    const rows = [{ name: 'Coffee Lab', distanceM: 120 }];
    (mockModel.aggregate as ReturnType<typeof vi.fn>).mockReturnValueOnce({ exec: () => Promise.resolve(rows) });

    const result = await placeRepository.findNear({
      lng: 44.79,
      lat: 41.71,
      radiusM: 500,
      categories: ['cafe'],
      limit: 50,
    });

    expect(mockMongo.connect).toHaveBeenCalled();
    expect(result).toEqual(rows);
    const pipeline = (mockModel.aggregate as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(pipeline[0].$geoNear).toMatchObject({
      near: { type: 'Point', coordinates: [44.79, 41.71] },
      distanceField: 'distanceM',
      maxDistance: 500,
      spherical: true,
      query: { category: { $in: ['cafe'] } },
    });
    expect(pipeline[1]).toEqual({ $limit: 50 });
  });

  it('countByCategoryNear groups places within the radius by category', async () => {
    const rows = [{ _id: 'cafe', count: 4 }];
    (mockModel.aggregate as ReturnType<typeof vi.fn>).mockReturnValueOnce({ exec: () => Promise.resolve(rows) });

    const result = await placeRepository.countByCategoryNear({ lng: 44.79, lat: 41.71, radiusM: 1000 });

    expect(result).toEqual(rows);
    const pipeline = (mockModel.aggregate as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(pipeline[0].$geoNear).toMatchObject({ maxDistance: 1000 });
    expect(pipeline[1]).toEqual({ $group: { _id: '$category', count: { $sum: 1 } } });
  });

  it('bulkUpsert upserts by osmId and reports counts', async () => {
    (mockModel.bulkWrite as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ upsertedCount: 1, modifiedCount: 0 });

    const result = await placeRepository.bulkUpsert([
      {
        osmId: 'node/1',
        name: 'Coffee Lab',
        nameKa: '',
        category: 'cafe',
        location: { type: 'Point', coordinates: [44.79, 41.71] },
        tags: { amenity: 'cafe' },
        source: 'osm',
      },
    ]);

    expect(result).toEqual({ upserted: 1, modified: 0 });
    const ops = (mockModel.bulkWrite as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(ops[0].updateOne).toMatchObject({ filter: { osmId: 'node/1' }, upsert: true });
  });
});
