import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/geocoding/repository/geocode-cache.repository', () => ({
  geocodeCacheRepository: {
    findByQuery: vi.fn(),
    save: vi.fn(),
  },
}));

vi.mock('@/shared/lib/nominatim', () => ({
  nominatim: {
    search: vi.fn(),
  },
}));

import { geocodeCacheRepository } from '@/features/geocoding/repository/geocode-cache.repository';
import { nominatim } from '@/shared/lib/nominatim';

import { geocodeService, normalizeQuery } from './geocoding.service';

const mockRepo = vi.mocked(geocodeCacheRepository);
const mockNominatim = vi.mocked(nominatim);

const RESULTS = [{ label: 'Vake Park, Tbilisi', lng: 44.75, lat: 41.71 }];

describe('normalizeQuery', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeQuery('  Vake   PARK ')).toBe('vake park');
  });
});

describe('geocodeService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns cached results without calling Nominatim', async () => {
    mockRepo.findByQuery.mockResolvedValueOnce({ query: 'vake park', results: RESULTS } as never);
    const result = await geocodeService({ query: 'Vake Park' });
    expect(result).toEqual({ data: RESULTS, status: 200 });
    expect(mockNominatim.search).not.toHaveBeenCalled();
  });

  it('calls Nominatim on a cache miss and stores the results', async () => {
    mockRepo.findByQuery.mockResolvedValueOnce(null);
    mockNominatim.search.mockResolvedValueOnce(RESULTS);
    const result = await geocodeService({ query: 'Vake Park' });
    expect(result).toEqual({ data: RESULTS, status: 200 });
    expect(mockNominatim.search).toHaveBeenCalledWith('vake park');
    expect(mockRepo.save).toHaveBeenCalledWith('vake park', RESULTS);
  });
});
