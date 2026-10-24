import { describe, it, expect, vi, afterEach } from 'vitest';

import { NominatimClient } from './nominatim';

function okResponse(body: unknown) {
  return { ok: true, json: () => Promise.resolve(body) };
}

describe('NominatimClient', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('searches within Georgia and maps results', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      okResponse([{ display_name: 'Chavchavadze Ave, Tbilisi', lat: '41.709', lon: '44.765' }])
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new NominatimClient({ baseUrl: 'http://nominatim.test', userAgent: 'test-agent', minIntervalMs: 0 });
    const results = await client.search('Chavchavadze');

    expect(results).toEqual([{ label: 'Chavchavadze Ave, Tbilisi', lng: 44.765, lat: 41.709 }]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('http://nominatim.test/search?');
    expect(url).toContain('countrycodes=ge');
    expect(url).toContain('q=Chavchavadze');
    expect(init.headers['User-Agent']).toBe('test-agent');
  });

  it('waits between consecutive requests', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([])));
    const client = new NominatimClient({ baseUrl: 'http://nominatim.test', minIntervalMs: 50 });

    const startedAt = Date.now();
    await client.search('a');
    await client.search('b');

    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(45);
  });

  it('throws on an error response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, statusText: 'Unavailable' }));
    const client = new NominatimClient({ baseUrl: 'http://nominatim.test', minIntervalMs: 0 });
    await expect(client.search('x')).rejects.toThrow('503');
  });
});
