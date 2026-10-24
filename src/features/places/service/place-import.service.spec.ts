import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/places/repository/place.repository', () => ({
  placeRepository: {
    bulkUpsert: vi.fn(),
    syncIndexes: vi.fn(),
  },
}));

vi.mock('@/shared/lib/overpass', () => ({
  overpass: {
    fetchElements: vi.fn(),
  },
}));

import { placeRepository } from '@/features/places/repository/place.repository';
import { overpass } from '@/shared/lib/overpass';

import { elementToPlace, importPlacesService } from './place-import.service';

const mockRepo = vi.mocked(placeRepository);
const mockOverpass = vi.mocked(overpass);

describe('elementToPlace', () => {
  it('maps a node with tags and coordinates', () => {
    const place = elementToPlace({
      type: 'node',
      id: 42,
      lat: 41.71,
      lon: 44.75,
      tags: { amenity: 'cafe', name: 'Coffee Lab', 'name:ka': 'ყავის ლაბი' },
    });
    expect(place).toEqual({
      osmId: 'node/42',
      name: 'Coffee Lab',
      nameKa: 'ყავის ლაბი',
      category: 'cafe',
      location: { type: 'Point', coordinates: [44.75, 41.71] },
      tags: { amenity: 'cafe', name: 'Coffee Lab', 'name:ka': 'ყავის ლაბი' },
      source: 'osm',
    });
  });

  it('uses the centre of ways', () => {
    const place = elementToPlace({ type: 'way', id: 7, center: { lat: 41.7, lon: 44.8 }, tags: { building: 'apartments' } });
    expect(place?.osmId).toBe('way/7');
    expect(place?.location.coordinates).toEqual([44.8, 41.7]);
    expect(place?.category).toBe('residential');
  });

  it('skips unmapped tags and elements without coordinates', () => {
    expect(elementToPlace({ type: 'node', id: 1, lat: 41.7, lon: 44.8, tags: { amenity: 'bench' } })).toBeNull();
    expect(elementToPlace({ type: 'relation', id: 2, tags: { amenity: 'cafe' } })).toBeNull();
  });
});

describe('importPlacesService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 for an unknown area', async () => {
    const result = await importPlacesService('atlantis');
    expect(result.status).toBe(400);
    expect(mockOverpass.fetchElements).not.toHaveBeenCalled();
  });

  it('imports mapped elements and reports a summary', async () => {
    mockOverpass.fetchElements.mockResolvedValueOnce([
      { type: 'node', id: 1, lat: 41.71, lon: 44.75, tags: { amenity: 'cafe' } },
      { type: 'node', id: 2, lat: 41.71, lon: 44.75, tags: { amenity: 'bench' } },
    ]);
    mockRepo.bulkUpsert.mockResolvedValueOnce({ upserted: 1, modified: 0 });

    const result = await importPlacesService('vake');

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ area: 'Vake', fetched: 2, skipped: 1, upserted: 1, modified: 0 });
    expect(mockRepo.syncIndexes).toHaveBeenCalled();
    expect(mockRepo.bulkUpsert).toHaveBeenCalledTimes(1);
  });
});
