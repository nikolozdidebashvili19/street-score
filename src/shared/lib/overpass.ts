import { type BoundingBox, type OsmTagRule } from '@/shared/const/places.const';

const DEFAULT_OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const QUERY_TIMEOUT_S = 120;
/** Overpass returns these when the public server is busy; they are worth retrying with backoff. */
const RETRYABLE_STATUSES = [429, 502, 503, 504];
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 10_000;

export type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

function escapeValue(value: string): string {
  return value.replace(/[\\"]/g, '\\$&');
}

class OverpassClient {
  constructor(
    private readonly baseUrl: string = process.env.OVERPASS_URL ?? DEFAULT_OVERPASS_URL,
    private readonly retryBaseDelayMs: number = RETRY_BASE_DELAY_MS
  ) {}

  buildQuery([west, south, east, north]: BoundingBox, rules: OsmTagRule[]): string {
    const bbox = `${south},${west},${north},${east}`;
    const statements = rules.map((rule) => {
      const filters = Object.entries(rule.match).map(([key, values]) => {
        if (values === '*') return `["${escapeValue(key)}"]`;
        return `["${escapeValue(key)}"~"^(${values.map(escapeValue).join('|')})$"]`;
      });
      return `  nwr${filters.join('')}(${bbox});`;
    });
    return `[out:json][timeout:${QUERY_TIMEOUT_S}];\n(\n${statements.join('\n')}\n);\nout center tags;`;
  }

  async fetchElements(bbox: BoundingBox, rules: OsmTagRule[], attempt = 0): Promise<OverpassElement[]> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': process.env.NOMINATIM_USER_AGENT ?? 'StreetPulse/0.1',
      },
      body: `data=${encodeURIComponent(this.buildQuery(bbox, rules))}`,
    });

    if (!response.ok && RETRYABLE_STATUSES.includes(response.status) && attempt < MAX_RETRIES) {
      console.warn(`Overpass busy (${response.status}), retrying… (${attempt + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, this.retryBaseDelayMs * 2 ** attempt));
      return this.fetchElements(bbox, rules, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(`Overpass request failed: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as OverpassResponse;
    return json.elements ?? [];
  }
}

export const overpass = new OverpassClient();
export { OverpassClient };
