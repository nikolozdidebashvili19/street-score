import { type PlaceRole } from '@/shared/utils/places';

/** Served from public/ by scripts/copy-maplibre-worker.mjs (runs before dev and build). */
export const MAPLIBRE_WORKER_URL = '/vendor/maplibre-gl-worker.mjs';

export const MAP_STYLE_URLS = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
} as const;


export const TBILISI_CENTER: [number, number] = [44.7930, 41.7151];

export const MAP_DEFAULT_ZOOM = 13;
export const MAP_FOCUS_ZOOM = 15;

/** Must exist on the OpenFreeMap glyph server (both liberty and dark styles serve it). */
export const MAP_LABEL_FONT = 'Noto Sans Regular';

export const MAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> · ' +
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> (ODbL)';

/** Hex values (MapLibre paint properties cannot read oklch CSS tokens); they mirror --brick, --positive, --transport. */
export const MAP_COLORS = {
  pin: '#2A201B',
  radius: '#2A201B',
  competitor: '#B4472C',
  activity: '#566B33',
  transport: '#3E6B8C',
  context: '#7D7065',
  competitorLabel: '#8A3220',
  stroke: '#FBF8F2',
} as const;

/** Legend text lives in the dictionaries under `legend.<role>`. */
export type MapLegendItem = {
  role: PlaceRole;
  dotClassName: string;
};

export const MAP_LEGEND: MapLegendItem[] = [
  { role: 'competitor', dotClassName: 'bg-risk' },
  { role: 'activity', dotClassName: 'bg-positive' },
  { role: 'transport', dotClassName: 'bg-transport' },
  { role: 'context', dotClassName: 'bg-muted-foreground/60' },
];
