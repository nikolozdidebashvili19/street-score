import { type ExpansionSite, type NetworkFit, type NetworkPoint } from '@/features/expansion/types/expansion.types';
import { type GridCountRow, type GridQuery } from '@/features/places/types/place.types';
import { scoreLocation } from '@/features/scoring/service/scoring.service';
import { type CategoryCounts } from '@/features/scoring/types/scoring.types';
import { BUSINESS_TYPES, type BusinessType } from '@/shared/const/business-types.const';
import { METRES_PER_DEGREE_LAT, SPOT_RATING_MIN_GAIN, type SpotRating } from '@/shared/const/expansion.const';
import { type BoundingBox, type PlaceCategory } from '@/shared/const/places.const';
import { distanceM, type LngLat } from '@/shared/utils/geo';

/**
 * Share (0–1) of one circular catchment covered by another of the same radius `distance` metres away:
 * the lens area of two equal circles divided by the area of one.
 */
export function catchmentOverlapShare(distance: number, radiusM: number): number {
  if (distance >= 2 * radiusM) return 0;
  if (distance <= 0) return 1;
  const x = distance / (2 * radiusM);
  return (2 / Math.PI) * (Math.acos(x) - x * Math.sqrt(1 - x * x));
}

/**
 * How a site sits against a network of branches. Overlap with several branches combines as
 * 1 − Π(1 − overlapᵢ), so two half-overlapping neighbours cover 75 % of the catchment, not 100 %.
 */
export function assessAgainstNetwork(
  point: LngLat,
  fit: number | null,
  network: NetworkPoint[],
  radiusM: number
): NetworkFit {
  let uncovered = 1;
  let nearestM: number | null = null;
  let nearestLabel: string | null = null;

  for (const other of network) {
    const distance = distanceM(point, other);
    uncovered *= 1 - catchmentOverlapShare(distance, radiusM);
    if (nearestM === null || distance < nearestM) {
      nearestM = distance;
      nearestLabel = other.label;
    }
  }

  const overlap = 1 - uncovered;
  return {
    fit,
    overlap: Math.round(100 * overlap),
    expansionScore: fit === null ? null : Math.round(fit * (1 - overlap)),
    nearestM: nearestM === null ? null : Math.round(nearestM),
    nearestLabel,
  };
}

/** One plain word for a spot's gain, so the page never has to show raw numbers. */
export function spotRating(expansionScore: number | null): SpotRating {
  const gain = expansionScore ?? 0;
  if (gain >= SPOT_RATING_MIN_GAIN.great) return 'great';
  if (gain >= SPOT_RATING_MIN_GAIN.good) return 'good';
  return 'okay';
}

export function gridQueryFor(bbox: BoundingBox, cellSizeM: number): GridQuery {
  const midLat = (bbox[1] + bbox[3]) / 2;
  const stepLat = cellSizeM / METRES_PER_DEGREE_LAT;
  const stepLng = cellSizeM / (METRES_PER_DEGREE_LAT * Math.cos((midLat * Math.PI) / 180));
  return { bbox, stepLng, stepLat };
}

const cellKey = (cx: number, cy: number) => `${cx}:${cy}`;

function cellOf(point: LngLat, { bbox, stepLng, stepLat }: GridQuery): [number, number] {
  return [Math.floor((point.lng - bbox[0]) / stepLng), Math.floor((point.lat - bbox[1]) / stepLat)];
}

function cellCentre(cx: number, cy: number, { bbox, stepLng, stepLat }: GridQuery): LngLat {
  return { lng: bbox[0] + (cx + 0.5) * stepLng, lat: bbox[1] + (cy + 0.5) * stepLat };
}

function sumCategories(counts: CategoryCounts, categories: PlaceCategory[]): number {
  return categories.reduce((total, category) => total + (counts[category] ?? 0), 0);
}

type Catchment = {
  offsets: [number, number][];
  /** Rescales summed cell counts so the square cells approximate the circle's true area. */
  correction: number;
};

export function catchmentOffsets(radiusM: number, cellSizeM: number): Catchment {
  const reach = Math.ceil(radiusM / cellSizeM);
  const offsets: [number, number][] = [];
  for (let dx = -reach; dx <= reach; dx += 1) {
    for (let dy = -reach; dy <= reach; dy += 1) {
      if ((dx * dx + dy * dy) * cellSizeM * cellSizeM <= radiusM * radiusM) offsets.push([dx, dy]);
    }
  }
  return { offsets, correction: (Math.PI * radiusM * radiusM) / (offsets.length * cellSizeM * cellSizeM) };
}

type GridScorerInput = {
  rows: GridCountRow[];
  query: GridQuery;
  cellSizeM: number;
  businessType: BusinessType;
  radiusM: number;
};

export type SiteCandidate = LngLat & {
  fit: number;
  competitors: number;
};

export type GridScorer = {
  /** One candidate per cell that has mapped places of its own and a score. */
  candidates: SiteCandidate[];
  scorePoint: (point: LngLat) => { fit: number | null; competitors: number };
};

/** Scores every cell centre with the regular location score, using counts summed over its catchment. */
export function createGridScorer({ rows, query, cellSizeM, businessType, radiusM }: GridScorerInput): GridScorer {
  const cells = new Map<string, CategoryCounts>();
  for (const { _id, count } of rows) {
    const key = cellKey(_id.cx, _id.cy);
    const counts = cells.get(key) ?? {};
    counts[_id.category] = (counts[_id.category] ?? 0) + count;
    cells.set(key, counts);
  }

  const { offsets, correction } = catchmentOffsets(radiusM, cellSizeM);
  const competitorCategories = BUSINESS_TYPES[businessType].competitorCategories;

  const scoreCell = (cx: number, cy: number) => {
    const summed: CategoryCounts = {};
    for (const [dx, dy] of offsets) {
      const counts = cells.get(cellKey(cx + dx, cy + dy));
      if (!counts) continue;
      for (const [category, count] of Object.entries(counts) as [PlaceCategory, number][]) {
        summed[category] = (summed[category] ?? 0) + count * correction;
      }
    }
    if (Object.keys(summed).length === 0) return { fit: null, competitors: 0 };
    const { total } = scoreLocation({ businessType, radiusM, counts: summed });
    return { fit: total, competitors: Math.round(sumCategories(summed, competitorCategories)) };
  };

  const candidates: SiteCandidate[] = [];
  for (const key of cells.keys()) {
    const [cx, cy] = key.split(':').map(Number);
    const { fit, competitors } = scoreCell(cx, cy);
    if (fit !== null) candidates.push({ ...cellCentre(cx, cy, query), fit, competitors });
  }

  return {
    candidates,
    scorePoint: (point) => scoreCell(...cellOf(point, query)),
  };
}

/**
 * Greedy network growth: each round picks the site adding the most new demand
 * (fit × uncovered share), then treats it as open, so later picks avoid it too.
 */
export function pickSites(
  candidates: SiteCandidate[],
  network: NetworkPoint[],
  radiusM: number,
  count: number
): ExpansionSite[] {
  const grown = [...network];
  const sites: ExpansionSite[] = [];

  for (let rank = 1; rank <= count; rank += 1) {
    let best: ExpansionSite | null = null;
    for (const candidate of candidates) {
      const assessed = assessAgainstNetwork(candidate, candidate.fit, grown, radiusM);
      const score = assessed.expansionScore ?? 0;
      const bestScore = best?.expansionScore ?? 0;
      if (!best || score > bestScore || (score === bestScore && candidate.fit > (best.fit ?? 0))) {
        best = { ...candidate, ...assessed, rank };
      }
    }
    if (!best || (best.expansionScore ?? 0) <= 0) break;
    sites.push(best);
    // Proposed sites are referred to by rank, which reads the same in every language.
    grown.push({ lng: best.lng, lat: best.lat, label: `#${rank}` });
  }

  return sites;
}
