import { type BusinessType } from '@/shared/const/business-types.const';

export const SCORE_FACTOR_KEYS = ['activity', 'competition', 'surroundings', 'transport', 'rent', 'on_site'] as const;

export type ScoreFactorKey = (typeof SCORE_FACTOR_KEYS)[number];

export const SCORE_SOURCE_KEYS = ['osm', 'user', 'siteVisit'] as const;

export type ScoreSourceKey = (typeof SCORE_SOURCE_KEYS)[number];

export const EVIDENCE_KEYS = [
  'activity',
  'competition',
  'surroundings',
  'surroundingsMissing',
  'transport',
  'rent',
  'rentMissing',
  'onSite',
  'onSiteMissing',
] as const;

export type EvidenceKey = (typeof EVIDENCE_KEYS)[number];

/**
 * Targets are expressed for SCORING_REFERENCE_RADIUS_M and scaled by search area,
 * so a 1 km radius needs four times as many places as 500 m to reach the same score.
 * Weights and targets are starting hypotheses (PRODUCT.md §4) — calibrate them (ticket 023).
 */
export type ScoringProfile = {
  weights: Record<ScoreFactorKey, number>;
  /** Complementary businesses within the reference radius that earn a full activity score. */
  activityTarget: number;
  /** Direct competitors within the reference radius at which competitor pressure scores 0. */
  competitorSaturation: number;
  residentialTarget: number;
  workplaceTarget: number;
  /** Share (0–1) of the surroundings score that comes from workplaces rather than homes. */
  workplaceShare: number;
  /** Weighted transport points (bus stop = 1, metro entrance = METRO_STOP_WEIGHT). */
  transportTarget: number;
};

export const SCORING_REFERENCE_RADIUS_M = 500;
export const METRO_STOP_WEIGHT = 3;
export const PEDESTRIAN_TARGET_PER_15_MIN = 150;
export const VISIBILITY_SCALE_MAX = 5;
/** Rent at or below this share of budget scores 100… */
export const RENT_RATIO_FULL_SCORE = 0.8;
/** …and at or above this share scores 0, linearly in between. */
export const RENT_RATIO_ZERO_SCORE = 1.5;

type WeightTuple = [activity: number, competition: number, surroundings: number, transport: number, rent: number, onSite: number];
type Targets = Omit<ScoringProfile, 'weights'>;

function profile([activity, competition, surroundings, transport, rent, onSite]: WeightTuple, targets: Targets): ScoringProfile {
  return { weights: { activity, competition, surroundings, transport, rent, on_site: onSite }, ...targets };
}

export const SCORING_PROFILES: Record<BusinessType, ScoringProfile> = {
  cafe: profile([25, 20, 20, 15, 10, 10], {
    activityTarget: 25, competitorSaturation: 12, residentialTarget: 40, workplaceTarget: 15, workplaceShare: 0.7, transportTarget: 8,
  }),
  restaurant: profile([25, 20, 20, 15, 10, 10], {
    activityTarget: 25, competitorSaturation: 15, residentialTarget: 40, workplaceTarget: 15, workplaceShare: 0.5, transportTarget: 8,
  }),
  fast_food: profile([25, 15, 15, 25, 10, 10], {
    activityTarget: 30, competitorSaturation: 15, residentialTarget: 40, workplaceTarget: 15, workplaceShare: 0.6, transportTarget: 10,
  }),
  bakery: profile([15, 20, 30, 15, 10, 10], {
    activityTarget: 15, competitorSaturation: 6, residentialTarget: 60, workplaceTarget: 10, workplaceShare: 0.3, transportTarget: 6,
  }),
  bar: profile([30, 15, 15, 20, 10, 10], {
    activityTarget: 30, competitorSaturation: 12, residentialTarget: 30, workplaceTarget: 10, workplaceShare: 0.4, transportTarget: 8,
  }),
  salon: profile([15, 25, 25, 15, 10, 10], {
    activityTarget: 15, competitorSaturation: 10, residentialTarget: 60, workplaceTarget: 10, workplaceShare: 0.3, transportTarget: 6,
  }),
  gym: profile([10, 25, 30, 15, 10, 10], {
    activityTarget: 10, competitorSaturation: 4, residentialTarget: 80, workplaceTarget: 10, workplaceShare: 0.2, transportTarget: 6,
  }),
  pharmacy: profile([20, 25, 25, 10, 10, 10], {
    activityTarget: 20, competitorSaturation: 6, residentialTarget: 60, workplaceTarget: 10, workplaceShare: 0.3, transportTarget: 6,
  }),
  dental: profile([15, 25, 30, 10, 10, 10], {
    activityTarget: 15, competitorSaturation: 5, residentialTarget: 60, workplaceTarget: 15, workplaceShare: 0.4, transportTarget: 6,
  }),
  retail: profile([30, 15, 15, 20, 10, 10], {
    activityTarget: 30, competitorSaturation: 15, residentialTarget: 40, workplaceTarget: 15, workplaceShare: 0.5, transportTarget: 10,
  }),
  grocery: profile([10, 25, 35, 10, 10, 10], {
    activityTarget: 10, competitorSaturation: 8, residentialTarget: 80, workplaceTarget: 10, workplaceShare: 0.15, transportTarget: 6,
  }),
  florist: profile([25, 20, 20, 15, 10, 10], {
    activityTarget: 25, competitorSaturation: 5, residentialTarget: 40, workplaceTarget: 10, workplaceShare: 0.4, transportTarget: 8,
  }),
  pet_shop: profile([15, 25, 30, 10, 10, 10], {
    activityTarget: 15, competitorSaturation: 4, residentialTarget: 70, workplaceTarget: 5, workplaceShare: 0.1, transportTarget: 6,
  }),
  kindergarten: profile([5, 25, 45, 5, 10, 10], {
    activityTarget: 10, competitorSaturation: 4, residentialTarget: 100, workplaceTarget: 10, workplaceShare: 0.1, transportTarget: 4,
  }),
  barbershop: profile([20, 25, 25, 10, 10, 10], {
    activityTarget: 15, competitorSaturation: 6, residentialTarget: 50, workplaceTarget: 15, workplaceShare: 0.4, transportTarget: 6,
  }),
  beauty_studio: profile([20, 25, 25, 10, 10, 10], {
    activityTarget: 15, competitorSaturation: 6, residentialTarget: 50, workplaceTarget: 10, workplaceShare: 0.3, transportTarget: 6,
  }),
  medical_clinic: profile([10, 25, 30, 15, 10, 10], {
    activityTarget: 10, competitorSaturation: 4, residentialTarget: 80, workplaceTarget: 15, workplaceShare: 0.2, transportTarget: 6,
  }),
  supermarket: profile([10, 25, 35, 10, 10, 10], {
    activityTarget: 10, competitorSaturation: 3, residentialTarget: 100, workplaceTarget: 10, workplaceShare: 0.15, transportTarget: 6,
  }),
  private_school: profile([5, 20, 45, 10, 10, 10], {
    activityTarget: 8, competitorSaturation: 4, residentialTarget: 100, workplaceTarget: 10, workplaceShare: 0.1, transportTarget: 6,
  }),
  // Weight 0: that factor is left out of the score (and the page) entirely.
  apartments: profile([30, 0, 20, 25, 15, 10], {
    activityTarget: 20, competitorSaturation: 1, residentialTarget: 60, workplaceTarget: 15, workplaceShare: 0.4, transportTarget: 8,
  }),
  office_building: profile([20, 15, 15, 30, 10, 10], {
    activityTarget: 25, competitorSaturation: 40, residentialTarget: 40, workplaceTarget: 20, workplaceShare: 0.5, transportTarget: 10,
  }),
};
