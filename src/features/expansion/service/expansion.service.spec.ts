import { describe, it, expect } from 'vitest';

import { type GridCountRow } from '@/features/places/types/place.types';

import {
  assessAgainstNetwork,
  catchmentOffsets,
  catchmentOverlapShare,
  createGridScorer,
  gridQueryFor,
  pickSites,
  spotRating,
  type SiteCandidate,
} from './expansion.service';

describe('spotRating', () => {
  it('turns gain into one plain word', () => {
    expect(spotRating(85)).toBe('great');
    expect(spotRating(70)).toBe('great');
    expect(spotRating(55)).toBe('good');
    expect(spotRating(20)).toBe('okay');
    expect(spotRating(null)).toBe('okay');
  });
});

const BBOX: [number, number, number, number] = [44.7, 41.7, 44.8, 41.75];
const CELL = 250;
const query = gridQueryFor(BBOX, CELL);

/** A point `metres` east of the origin, at the bbox's mid latitude. */
const east = (metres: number) => ({ lng: 44.75 + metres * query.stepLng / CELL, lat: 41.725 });

describe('catchmentOverlapShare', () => {
  it('is 1 for the same spot and 0 once catchments stop touching', () => {
    expect(catchmentOverlapShare(0, 500)).toBe(1);
    expect(catchmentOverlapShare(1000, 500)).toBe(0);
    expect(catchmentOverlapShare(1500, 500)).toBe(0);
  });

  it('shrinks monotonically with distance', () => {
    const near = catchmentOverlapShare(200, 500);
    const mid = catchmentOverlapShare(500, 500);
    const far = catchmentOverlapShare(900, 500);
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(far);
    // Two circles one radius apart share ~39 % of their area.
    expect(mid).toBeCloseTo(0.391, 2);
  });
});

describe('assessAgainstNetwork', () => {
  it('leaves an isolated site at full fit', () => {
    const result = assessAgainstNetwork(east(0), 80, [{ ...east(3000), label: 'Vake' }], 500);
    expect(result).toMatchObject({ fit: 80, overlap: 0, expansionScore: 80, nearestLabel: 'Vake' });
    expect(result.nearestM).toBeGreaterThan(2900);
  });

  it('combines overlaps as 1 − Π(1 − overlapᵢ) and discounts the fit', () => {
    const share = catchmentOverlapShare(500, 500);
    const network = [
      { ...east(-500), label: 'West' },
      { ...east(500), label: 'East' },
    ];
    const result = assessAgainstNetwork(east(0), 100, network, 500);
    const combined = 1 - (1 - share) ** 2;
    expect(result.overlap).toBe(Math.round(100 * combined));
    expect(result.expansionScore).toBe(Math.round(100 * (1 - combined)));
  });

  it('keeps expansion score null when the site has no data', () => {
    expect(assessAgainstNetwork(east(0), null, [], 500)).toMatchObject({ expansionScore: null, nearestM: null });
  });
});

describe('catchmentOffsets', () => {
  it('covers roughly the circle and corrects to its true area', () => {
    const { offsets, correction } = catchmentOffsets(500, 250);
    expect(offsets).toContainEqual([0, 0]);
    expect(offsets).toContainEqual([2, 0]);
    expect(offsets).not.toContainEqual([2, 2]);
    expect(offsets.length * 250 * 250 * correction).toBeCloseTo(Math.PI * 500 * 500, 6);
  });
});

describe('createGridScorer', () => {
  const rows: GridCountRow[] = [
    { _id: { cx: 10, cy: 10, category: 'restaurant' }, count: 12 },
    { _id: { cx: 10, cy: 10, category: 'bus_stop' }, count: 3 },
    { _id: { cx: 11, cy: 10, category: 'cafe' }, count: 2 },
    { _id: { cx: 11, cy: 10, category: 'office' }, count: 6 },
  ];

  it('creates one candidate per populated cell and counts competitors in the catchment', () => {
    const scorer = createGridScorer({ rows, query, cellSizeM: CELL, businessType: 'cafe', radiusM: 500 });
    expect(scorer.candidates).toHaveLength(2);
    expect(scorer.candidates.every((candidate) => candidate.fit > 0)).toBe(true);
    // Both cells see the neighbouring cell's cafés.
    expect(scorer.candidates.every((candidate) => candidate.competitors > 0)).toBe(true);
  });

  it('returns no fit for a point with nothing mapped nearby', () => {
    const scorer = createGridScorer({ rows, query, cellSizeM: CELL, businessType: 'cafe', radiusM: 500 });
    expect(scorer.scorePoint({ lng: 44.79, lat: 41.745 })).toEqual({ fit: null, competitors: 0 });
  });
});

describe('pickSites', () => {
  const candidates: SiteCandidate[] = [
    { ...east(0), fit: 90, competitors: 1 },
    { ...east(250), fit: 88, competitors: 1 },
    { ...east(3000), fit: 70, competitors: 0 },
  ];

  it('avoids sites that sit on top of an existing branch', () => {
    const [first] = pickSites(candidates, [{ ...east(0), label: 'Flagship' }], 500, 1);
    expect(first.fit).toBe(70);
    expect(first.overlap).toBe(0);
  });

  it('treats each pick as opened, so later picks avoid it too', () => {
    const sites = pickSites(candidates, [], 500, 2);
    expect(sites.map((site) => site.fit)).toEqual([90, 70]);
    expect(sites.map((site) => site.rank)).toEqual([1, 2]);
  });

  it('stops early when no candidate adds new demand', () => {
    const sites = pickSites([{ ...east(0), fit: 90, competitors: 0 }], [{ ...east(0), label: 'A' }], 500, 3);
    expect(sites).toHaveLength(0);
  });
});
