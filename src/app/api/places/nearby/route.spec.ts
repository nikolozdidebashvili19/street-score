import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/features/places/service/place.service', () => ({
  getNearbyPlacesService: vi.fn(),
}));

import { getNearbyPlacesService } from '@/features/places/service/place.service';

import { POST } from './route';

const mockService = vi.mocked(getNearbyPlacesService);

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/places/nearby', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/places/nearby', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with nearby places', async () => {
    mockService.mockResolvedValueOnce({ data: [], status: 200 });
    const res = await POST(makeRequest({ lng: 44.75, lat: 41.71, radiusM: 500 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('returns 400 for out-of-range coordinates', async () => {
    const res = await POST(makeRequest({ lng: 200, lat: 41.71, radiusM: 500 }));
    expect(res.status).toBe(400);
    expect(mockService).not.toHaveBeenCalled();
  });

  it('returns 400 for an unknown category', async () => {
    const res = await POST(makeRequest({ lng: 44.75, lat: 41.71, radiusM: 500, categories: ['casino'] }));
    expect(res.status).toBe(400);
  });

  it('returns 500 when the service throws', async () => {
    mockService.mockRejectedValueOnce(new Error('DB down'));
    const res = await POST(makeRequest({ lng: 44.75, lat: 41.71, radiusM: 500 }));
    expect(res.status).toBe(500);
  });
});
