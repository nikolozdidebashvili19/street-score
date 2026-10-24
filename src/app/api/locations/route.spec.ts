import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/shared/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/features/locations/service/location.service', () => ({
  createLocationService: vi.fn(),
  listLocationsService: vi.fn(),
}));

import { createLocationService, listLocationsService } from '@/features/locations/service/location.service';
import { auth } from '@/shared/lib/auth';

import { GET, POST } from './route';

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(createLocationService);
const mockList = vi.mocked(listLocationsService);

const USER_ID = '507f1f77bcf86cd799439011';

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/locations', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const validBody = { label: 'Vake corner', businessType: 'cafe', radiusM: 500, lng: 44.75, lat: 41.71 };

describe('/api/locations', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET returns 401 without a session', async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(mockList).not.toHaveBeenCalled();
  });

  it('GET lists the session user locations', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: USER_ID } } as never);
    mockList.mockResolvedValueOnce({ data: [], status: 200 });
    const res = await GET();
    expect(res.status).toBe(200);
    expect(mockList).toHaveBeenCalledWith(USER_ID);
  });

  it('POST creates a location for the session user, ignoring any client userId', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: USER_ID } } as never);
    mockCreate.mockResolvedValueOnce({ data: { id: 'x' } as never, status: 201 });
    const res = await POST(makeRequest({ ...validBody, userId: 'attacker' }));
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith(USER_ID, expect.not.objectContaining({ userId: 'attacker' }));
  });

  it('POST returns 400 for an invalid body', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: USER_ID } } as never);
    const res = await POST(makeRequest({ ...validBody, label: '' }));
    expect(res.status).toBe(400);
  });

  it('POST returns 500 when the service throws', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: USER_ID } } as never);
    mockCreate.mockRejectedValueOnce(new Error('DB down'));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
