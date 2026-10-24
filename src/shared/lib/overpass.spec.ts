import { describe, it, expect, vi, afterEach } from 'vitest';

import { OverpassClient } from './overpass';

const BBOX: [number, number, number, number] = [44.73, 41.70, 44.77, 41.72];

describe('OverpassClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('builds a query with south,west,north,east bbox order', () => {
    const client = new OverpassClient('http://overpass.test');
    const query = client.buildQuery(BBOX, [{ match: { amenity: ['cafe'] }, category: 'cafe' }]);
    expect(query).toContain('nwr["amenity"~"^(cafe)$"](41.7,44.73,41.72,44.77);');
    expect(query).toContain('out center tags;');
    expect(query).toContain('[out:json][timeout:120]');
  });

  it('builds wildcard and multi-key filters', () => {
    const client = new OverpassClient('http://overpass.test');
    const query = client.buildQuery(BBOX, [
      { match: { office: '*' }, category: 'office' },
      { match: { leisure: ['sports_centre'], sport: ['fitness', 'yoga'] }, category: 'gym' },
    ]);
    expect(query).toContain('nwr["office"](');
    expect(query).toContain('nwr["leisure"~"^(sports_centre)$"]["sport"~"^(fitness|yoga)$"](');
  });

  it('posts the query and returns elements', async () => {
    const elements = [{ type: 'node', id: 1, lat: 41.71, lon: 44.75, tags: { amenity: 'cafe' } }];
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ elements }) });
    vi.stubGlobal('fetch', fetchMock);

    const client = new OverpassClient('http://overpass.test');
    const result = await client.fetchElements(BBOX, [{ match: { amenity: ['cafe'] }, category: 'cafe' }]);

    expect(result).toEqual(elements);
    expect(fetchMock).toHaveBeenCalledWith('http://overpass.test', expect.objectContaining({ method: 'POST' }));
    expect(fetchMock.mock.calls[0][1].body).toMatch(/^data=/);
  });

  it('retries busy responses and then succeeds', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 502, statusText: 'Bad Gateway' })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ elements: [] }) });
    vi.stubGlobal('fetch', fetchMock);

    const client = new OverpassClient('http://overpass.test', 0);
    await expect(client.fetchElements(BBOX, [])).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting retries', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 429, statusText: 'Too Many Requests' });
    vi.stubGlobal('fetch', fetchMock);
    const client = new OverpassClient('http://overpass.test', 0);
    await expect(client.fetchElements(BBOX, [])).rejects.toThrow('429');
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('does not retry client errors', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 400, statusText: 'Bad Request' });
    vi.stubGlobal('fetch', fetchMock);
    const client = new OverpassClient('http://overpass.test', 0);
    await expect(client.fetchElements(BBOX, [])).rejects.toThrow('400');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
