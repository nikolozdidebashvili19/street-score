import { IMPORT_AREAS, type BoundingBox } from '@/shared/const/places.const';

/** Where new branches may go — the area the OSM import covers. */
export const EXPANSION_SEARCH_BBOX: BoundingBox = IMPORT_AREAS.tbilisi.bbox;

/** Mapped places are bucketed into square cells of this size; each cell centre is a possible site. */
export const EXPANSION_CELL_SIZE_M = 250;

export const METRES_PER_DEGREE_LAT = 111_320;

export const MIN_NEW_BRANCHES = 1;
export const MAX_NEW_BRANCHES = 10;
export const DEFAULT_NEW_BRANCHES = 1;

/** The simple choices offered on the page (the API accepts up to MAX_NEW_BRANCHES). */
export const NEW_BRANCH_OPTIONS = [1, 2, 3, 4, 5] as const;

export type SpotRating = 'great' | 'good' | 'okay';

/** Gain (fit × uncovered share) at or above which a spot earns each word; anything lower is "okay". */
export const SPOT_RATING_MIN_GAIN: Record<Exclude<SpotRating, 'okay'>, number> = {
  great: 70,
  good: 50,
};

export const MAX_BRANCHES = 50;

/** Overlap (0–100) at or above which a site mostly serves customers an existing branch already reaches. */
export const HIGH_OVERLAP_PERCENT = 40;
