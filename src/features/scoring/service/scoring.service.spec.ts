import { describe, it, expect } from 'vitest';

import { type ScoreFactor } from '@/features/scoring/types/scoring.types';

import { clampScore, computeFactors, computeScore, scoreLocation } from './scoring.service';

function factor(weight: number, value: number | null): ScoreFactor {
  return { key: 'activity', label: 'x', weight, value, source: 'test', confidence: value === null ? 'none' : 'medium', evidence: '' };
}

function byKey(factors: ScoreFactor[], key: ScoreFactor['key']) {
  return factors.find((item) => item.key === key)!;
}

describe('clampScore', () => {
  it('clamps to 0–100 and rounds', () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(140)).toBe(100);
    expect(clampScore(42.6)).toBe(43);
  });
});

describe('computeScore', () => {
  it('applies S = Σ(w·s) / Σ(w)', () => {
    expect(computeScore([factor(25, 80), factor(75, 40)])).toEqual({ total: 50, coverage: 100 });
  });

  it('excludes missing factors instead of counting them as 0', () => {
    const result = computeScore([factor(50, 80), factor(50, null)]);
    expect(result.total).toBe(80);
    expect(result.coverage).toBe(50);
  });

  it('returns a null total when no factor has data', () => {
    expect(computeScore([factor(10, null), factor(20, null)])).toEqual({ total: null, coverage: 0 });
  });
});

describe('computeFactors', () => {
  it('returns six factors with the café weights from PRODUCT.md', () => {
    const factors = computeFactors({ businessType: 'cafe', radiusM: 500, counts: {} });
    expect(factors.map((item) => [item.key, item.weight])).toEqual([
      ['activity', 25],
      ['competition', 20],
      ['surroundings', 20],
      ['transport', 15],
      ['rent', 10],
      ['on_site', 10],
    ]);
  });

  it('flags rent, on-site and empty surroundings as missing data', () => {
    const factors = computeFactors({ businessType: 'cafe', radiusM: 500, counts: { cafe: 2 } });
    for (const key of ['rent', 'on_site', 'surroundings'] as const) {
      expect(byKey(factors, key).value).toBeNull();
      expect(byKey(factors, key).confidence).toBe('none');
    }
  });

  it('lowers competitor pressure as competitors increase', () => {
    const few = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts: { cafe: 1 } }), 'competition');
    const many = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts: { cafe: 10 } }), 'competition');
    const saturated = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts: { cafe: 30 } }), 'competition');
    expect(few.value!).toBeGreaterThan(many.value!);
    expect(saturated.value).toBe(0);
  });

  it('scales targets with the search area', () => {
    const counts = { bus_stop: 4 };
    const small = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts }), 'transport');
    const large = byKey(computeFactors({ businessType: 'cafe', radiusM: 1000, counts }), 'transport');
    expect(small.value).toBe(50);
    expect(large.value).toBe(13);
  });

  it('weights metro entrances higher than bus stops', () => {
    const transport = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts: { metro_station: 1, bus_stop: 1 } }), 'transport');
    expect(transport.value).toBe(50);
  });

  it('scores rent against budget', () => {
    const cheap = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts: {}, rentGel: 2000, budgetGel: 3000 }), 'rent');
    const pricey = byKey(computeFactors({ businessType: 'cafe', radiusM: 500, counts: {}, rentGel: 6000, budgetGel: 3000 }), 'rent');
    expect(cheap.value).toBe(100);
    expect(cheap.confidence).toBe('high');
    expect(pricey.value).toBe(0);
  });

  it('averages pedestrian count and visibility for on-site observations', () => {
    const onSite = byKey(
      computeFactors({ businessType: 'cafe', radiusM: 500, counts: {}, observations: { pedestrianPer15Min: 75, visibility: 5 } }),
      'on_site'
    );
    expect(onSite.value).toBe(75);
  });
});

describe('scoreLocation', () => {
  it('is deterministic', () => {
    const input = { businessType: 'gym' as const, radiusM: 1000, counts: { gym: 2, residential: 120, bus_stop: 10 } };
    expect(scoreLocation(input)).toEqual(scoreLocation(input));
  });

  it('reports partial coverage when user data is missing', () => {
    const result = scoreLocation({ businessType: 'cafe', radiusM: 500, counts: { cafe: 3, office: 10, bus_stop: 5 } });
    expect(result.coverage).toBe(80);
    expect(result.total).not.toBeNull();
  });
});
