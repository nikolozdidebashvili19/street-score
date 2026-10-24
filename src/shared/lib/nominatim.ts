const DEFAULT_NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const MIN_INTERVAL_MS = 1100;
const RESULT_LIMIT = 5;
/** Bias results towards Tbilisi without excluding the rest of Georgia. */
const TBILISI_VIEWBOX = '44.65,41.82,44.99,41.62';

export type GeocodeResult = {
  label: string;
  lng: number;
  lat: number;
};

type NominatimPlace = {
  display_name: string;
  lat: string;
  lon: string;
};

type NominatimClientOptions = {
  baseUrl?: string;
  userAgent?: string;
  minIntervalMs?: number;
};

class NominatimClient {
  private readonly baseUrl: string;
  private readonly userAgent: string;
  private readonly minIntervalMs: number;
  private lastRequestAt = 0;

  constructor(options: NominatimClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? process.env.NOMINATIM_URL ?? DEFAULT_NOMINATIM_URL;
    this.userAgent = options.userAgent ?? process.env.NOMINATIM_USER_AGENT ?? 'StreetPulse/0.1';
    this.minIntervalMs = options.minIntervalMs ?? MIN_INTERVAL_MS;
  }

  /** Nominatim's usage policy allows at most one request per second. */
  private async throttle(): Promise<void> {
    const waitMs = this.lastRequestAt + this.minIntervalMs - Date.now();
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    this.lastRequestAt = Date.now();
  }

  async search(query: string): Promise<GeocodeResult[]> {
    await this.throttle();

    const params = new URLSearchParams({
      q: query,
      format: 'jsonv2',
      countrycodes: 'ge',
      'accept-language': 'ka,en',
      viewbox: TBILISI_VIEWBOX,
      limit: String(RESULT_LIMIT),
    });

    const response = await fetch(`${this.baseUrl}/search?${params.toString()}`, {
      headers: { 'User-Agent': this.userAgent },
    });

    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status} ${response.statusText}`);
    }

    const places = (await response.json()) as NominatimPlace[];
    return places.map((place) => ({
      label: place.display_name,
      lng: Number(place.lon),
      lat: Number(place.lat),
    }));
  }
}

export const nominatim = new NominatimClient();
export { NominatimClient };
