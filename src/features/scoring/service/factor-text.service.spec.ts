import { describe, it, expect } from 'vitest';

import { type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { BUSINESS_TYPE_KEYS, BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { DICTIONARIES } from '@/shared/const/dictionaries.const';
import { PLACE_CATEGORY_KEYS } from '@/shared/const/places.const';
import { SCORING_PROFILES } from '@/shared/const/scoring.const';

import { describeFactor, factorVerdict } from './factor-text.service';
import { computeFactors, scoreLocation } from './scoring.service';

const byKey = (factors: ScoreFactor[], key: ScoreFactor['key']) => factors.find((item) => item.key === key)!;

describe('describeFactor', () => {
  const factors = computeFactors({ businessType: 'bakery', radiusM: 500, counts: { bakery: 2, bus_stop: 3 } });

  it('renders English from keys and params', () => {
    const text = describeFactor(byKey(factors, 'competition'), 'bakery', 'en');
    expect(text.label).toBe(DICTIONARIES.en.score.factors.competition);
    expect(text.source).toBe('OpenStreetMap');
    expect(text.evidence).toBe('2 shops like yours within 500 m.');
    expect(text.question).toBe(DICTIONARIES.en.score.questions.competition);
  });

  it('uses real estate wording for property types', () => {
    const office = computeFactors({ businessType: 'office_building', radiusM: 500, counts: { office: 4 } });
    const text = describeFactor(byKey(office, 'competition'), 'office_building', 'en');
    expect(text.label).toBe('Other office buildings');
    expect(text.evidence).toBe('4 office buildings within 500 m.');
    expect(describeFactor(byKey(office, 'rent'), 'office_building', 'ka').label).toBe(
      DICTIONARIES.ka.score.property.factors.rent
    );
  });

  it('renders Georgian with Georgian category names', () => {
    const transport = describeFactor(byKey(factors, 'transport'), 'bakery', 'ka');
    expect(transport.label).toBe(DICTIONARIES.ka.score.factors.transport);
    expect(transport.evidence).toBe('3 ავტობუსის გაჩერება და მეტროს 0 შესასვლელი.');

    const activity = describeFactor(byKey(factors, 'activity'), 'bakery', 'ka');
    expect(activity.evidence).toContain('სუპერმარკეტი');
    expect(activity.evidence).not.toMatch(/\{\w+\}/);
  });

  it('falls back to stored English text for snapshots without keys', () => {
    const legacy: ScoreFactor = {
      key: 'rent', label: 'Rent vs. your budget', weight: 10, value: null,
      source: 'Your input', confidence: 'none', evidence: 'Legacy evidence.',
    };
    const text = describeFactor(legacy, 'cafe', 'ka');
    expect(text.label).toBe(DICTIONARIES.ka.score.factors.rent);
    expect(text.evidence).toBe('Legacy evidence.');
    expect(text.source).toBe('Your input');
  });
});

describe('business types', () => {
  it('reference only known place categories and have weights summing to 100', () => {
    for (const key of BUSINESS_TYPE_KEYS) {
      const meta = BUSINESS_TYPES[key];
      for (const category of [...meta.competitorCategories, ...meta.activityCategories]) {
        expect(PLACE_CATEGORY_KEYS).toContain(category);
      }
      expect(meta.competitorCategories.some((category) => meta.activityCategories.includes(category))).toBe(false);
      const weights = Object.values(SCORING_PROFILES[key].weights);
      expect(weights.reduce((sum, weight) => sum + weight, 0)).toBe(100);
    }
  });

  it('can all be scored', () => {
    for (const key of BUSINESS_TYPE_KEYS) {
      const score = scoreLocation({ businessType: key, radiusM: 500, counts: { residential: 30, bus_stop: 2 } });
      expect(score.total).not.toBeNull();
      const weighted = Object.values(SCORING_PROFILES[key].weights).filter((weight) => weight > 0);
      expect(score.factors).toHaveLength(weighted.length);
    }
  });

  it('leaves zero-weight factors out instead of showing them', () => {
    const score = scoreLocation({ businessType: 'apartments', radiusM: 1000, counts: { school: 2 } });
    expect(score.factors.map((factor) => factor.key)).not.toContain('competition');
  });
});

describe('factorVerdict', () => {
  it('turns a value into one word', () => {
    expect(factorVerdict(85)).toBe('good');
    expect(factorVerdict(55)).toBe('okay');
    expect(factorVerdict(20)).toBe('weak');
    expect(factorVerdict(null)).toBe('none');
  });
});
