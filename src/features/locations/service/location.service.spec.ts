import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/locations/repository/candidate-location.repository', () => ({
  candidateLocationRepository: {
    create: vi.fn(),
    findByUser: vi.fn(),
    deleteByIdForUser: vi.fn(),
  },
}));

vi.mock('@/features/scoring/service/score-location.service', () => ({
  scoreLocationService: vi.fn(),
}));

import { candidateLocationRepository } from '@/features/locations/repository/candidate-location.repository';
import { scoreLocationService } from '@/features/scoring/service/score-location.service';

import { createLocationService, deleteLocationService, listLocationsService } from './location.service';

const mockRepo = vi.mocked(candidateLocationRepository);
const mockScore = vi.mocked(scoreLocationService);

const USER_ID = '507f1f77bcf86cd799439011';
const OTHER_USER_ID = '507f1f77bcf86cd799439099';

const score = { businessType: 'cafe' as const, radiusM: 500, total: 72, coverage: 80, factors: [] };

const fakeDoc = {
  _id: { toString: () => '65f000000000000000000001' },
  userId: USER_ID,
  label: 'Vake corner',
  address: 'Chavchavadze Ave 37',
  businessType: 'cafe',
  radiusM: 500,
  location: { type: 'Point', coordinates: [44.75, 41.71] },
  rentGel: null,
  budgetGel: null,
  observations: [],
  score: { total: 72, coverage: 80, factors: [], counts: new Map([['cafe', 3]]), computedAt: new Date() },
  createdAt: new Date('2026-10-23T10:00:00Z'),
};

const input = {
  label: 'Vake corner',
  address: 'Chavchavadze Ave 37',
  businessType: 'cafe' as const,
  radiusM: 500,
  lng: 44.75,
  lat: 41.71,
};

describe('createLocationService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('scores on the server and stores the snapshot for the session user', async () => {
    mockScore.mockResolvedValueOnce({ data: { score, counts: { cafe: 3 } }, status: 200 });
    mockRepo.create.mockResolvedValueOnce(fakeDoc as never);

    const result = await createLocationService(USER_ID, input);

    expect(result.status).toBe(201);
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: USER_ID,
        location: { type: 'Point', coordinates: [44.75, 41.71] },
        score: expect.objectContaining({ total: 72, coverage: 80, counts: { cafe: 3 } }),
      })
    );
    expect(result.data).toMatchObject({ id: '65f000000000000000000001', lng: 44.75, lat: 41.71, counts: { cafe: 3 } });
  });
});

describe('listLocationsService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('only queries the requesting user', async () => {
    mockRepo.findByUser.mockResolvedValueOnce([{ ...fakeDoc, score: { ...fakeDoc.score, counts: { cafe: 3 } } }] as never);
    const result = await listLocationsService(USER_ID);
    expect(mockRepo.findByUser).toHaveBeenCalledWith(USER_ID);
    expect(result.data).toHaveLength(1);
    expect((result.data as { score: { total: number } }[])[0].score.total).toBe(72);
  });
});

describe('deleteLocationService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('scopes deletion to the user and returns 404 when nothing matched', async () => {
    mockRepo.deleteByIdForUser.mockResolvedValueOnce(false);
    const result = await deleteLocationService(OTHER_USER_ID, '65f000000000000000000001');
    expect(mockRepo.deleteByIdForUser).toHaveBeenCalledWith('65f000000000000000000001', OTHER_USER_ID);
    expect(result.status).toBe(404);
  });

  it('returns 200 when the location was deleted', async () => {
    mockRepo.deleteByIdForUser.mockResolvedValueOnce(true);
    const result = await deleteLocationService(USER_ID, '65f000000000000000000001');
    expect(result.status).toBe(200);
  });
});
