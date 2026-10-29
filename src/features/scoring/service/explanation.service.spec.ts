import { describe, it, expect } from 'vitest';

import { type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { BASELINE_VERIFY_KEYS, PROPERTY_VERIFY_KEYS } from '@/shared/const/explanations.const';

import { explainScore } from './explanation.service';

function factor(key: ScoreFactor['key'], weight: number, value: number | null): ScoreFactor {
  return { key, label: key, weight, value, source: 'OpenStreetMap', confidence: 'medium', evidence: `${key} evidence` };
}

const score = {
  businessType: 'cafe' as const,
  radiusM: 500,
  total: 60,
  coverage: 80,
  factors: [
    factor('activity', 25, 90),
    factor('competition', 20, 20),
    factor('surroundings', 20, 55),
    factor('transport', 15, 75),
    factor('rent', 10, null),
    factor('on_site', 10, null),
  ],
};

const baseline = BASELINE_VERIFY_KEYS.map((key) => ({ kind: 'baseline', key }));

describe('explainScore', () => {
  it('lists strong factors as advantages, strongest weighted first, keeping the factor for its source', () => {
    const { advantages } = explainScore(score);
    expect(advantages.map((item) => item.factorKey)).toEqual(['activity', 'transport']);
    expect(advantages[0].factor.source).toBe('OpenStreetMap');
  });

  it('lists weak factors as risks and leaves middling factors out', () => {
    const { risks, advantages } = explainScore(score);
    expect(risks.map((item) => item.factorKey)).toEqual(['competition']);
    expect([...risks, ...advantages].some((item) => item.factorKey === 'surroundings')).toBe(false);
  });

  it('flags missing factors and puts their checks before the baseline checklist', () => {
    const { missing, verify } = explainScore(score);
    expect(missing.map((item) => item.factorKey)).toEqual(['rent', 'on_site']);
    expect(verify).toEqual([
      { kind: 'missing', factorKey: 'rent' },
      { kind: 'missing', factorKey: 'on_site' },
      ...baseline,
    ]);
  });

  it('always returns the baseline checklist', () => {
    const complete = { ...score, factors: score.factors.map((item) => ({ ...item, value: item.value ?? 50 })) };
    expect(explainScore(complete).verify).toEqual(baseline);
  });

  it('gives real estate its own checklist (zoning, ownership, prices, utilities)', () => {
    const complete = { ...score, businessType: 'apartments' as const, factors: [factor('transport', 25, 80)] };
    expect(explainScore(complete).verify).toEqual(PROPERTY_VERIFY_KEYS.map((key) => ({ kind: 'baseline', key })));
  });
});
