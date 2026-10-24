import { type LocationScore, type ScoreFactor, type ScoringInput } from '@/features/scoring/types/scoring.types';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { EN_APP_DICTIONARY } from '@/shared/const/dictionary-en-app.const';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/shared/const/places.const';
import {
  METRO_STOP_WEIGHT,
  PEDESTRIAN_TARGET_PER_15_MIN,
  RENT_RATIO_FULL_SCORE,
  RENT_RATIO_ZERO_SCORE,
  SCORING_PROFILES,
  SCORING_REFERENCE_RADIUS_M,
  VISIBILITY_SCALE_MAX,
  type ScoreFactorKey,
} from '@/shared/const/scoring.const';
import { formatMessage } from '@/shared/utils/i18n';

const EN_SCORE = EN_APP_DICTIONARY.score;

export function clampScore(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function sumCounts(counts: ScoringInput['counts'], categories: PlaceCategory[]): number {
  return categories.reduce((total, category) => total + (counts[category] ?? 0), 0);
}

/** Category list for the activity evidence sentence, in English or Georgian. */
export function activityCategoryList(businessType: ScoringInput['businessType'], georgian = false): string {
  return BUSINESS_TYPES[businessType].activityCategories
    .map((category) => (georgian ? PLACE_CATEGORIES[category].labelKa : PLACE_CATEGORIES[category].label.toLowerCase()))
    .join(', ');
}

type FactorDraft = Pick<ScoreFactor, 'value' | 'confidence'> &
  Required<Pick<ScoreFactor, 'sourceKey' | 'evidenceKey' | 'evidenceParams'>>;

function computeDrafts(input: ScoringInput): Record<ScoreFactorKey, FactorDraft> {
  const { businessType, radiusM: radius, counts, rentGel, budgetGel, observations } = input;
  const business = BUSINESS_TYPES[businessType];
  const profile = SCORING_PROFILES[businessType];
  const areaScale = (radius / SCORING_REFERENCE_RADIUS_M) ** 2;

  const activity = sumCounts(counts, business.activityCategories);
  const competitors = sumCounts(counts, business.competitorCategories);
  const residential = counts.residential ?? 0;
  const workplaces = sumCounts(counts, ['office', 'university']);
  const busStops = counts.bus_stop ?? 0;
  const metro = counts.metro_station ?? 0;

  const residentialScore = clampScore((100 * residential) / (profile.residentialTarget * areaScale));
  const workplaceScore = clampScore((100 * workplaces) / (profile.workplaceTarget * areaScale));
  const surroundingsScore = clampScore(
    (1 - profile.workplaceShare) * residentialScore + profile.workplaceShare * workplaceScore
  );

  const hasRent = typeof rentGel === 'number' && typeof budgetGel === 'number' && budgetGel > 0;
  const rentRatio = hasRent ? rentGel / budgetGel : 0;
  const rentScore = clampScore(
    (100 * (RENT_RATIO_ZERO_SCORE - rentRatio)) / (RENT_RATIO_ZERO_SCORE - RENT_RATIO_FULL_SCORE)
  );

  const onSiteParts: number[] = [];
  if (typeof observations?.pedestrianPer15Min === 'number') {
    onSiteParts.push(clampScore((100 * observations.pedestrianPer15Min) / PEDESTRIAN_TARGET_PER_15_MIN));
  }
  if (typeof observations?.visibility === 'number') {
    onSiteParts.push(clampScore((100 * (observations.visibility - 1)) / (VISIBILITY_SCALE_MAX - 1)));
  }
  const hasSurroundings = residential + workplaces > 0;

  return {
    activity: {
      value: clampScore((100 * activity) / (profile.activityTarget * areaScale)),
      sourceKey: 'osm',
      confidence: activity > 0 ? 'medium' : 'low',
      evidenceKey: 'activity',
      evidenceParams: { count: activity, radius },
    },
    competition: {
      value: clampScore(100 * (1 - competitors / (profile.competitorSaturation * areaScale))),
      sourceKey: 'osm',
      confidence: 'medium',
      evidenceKey: 'competition',
      evidenceParams: { count: competitors, radius },
    },
    surroundings: {
      value: hasSurroundings ? surroundingsScore : null,
      sourceKey: 'osm',
      confidence: hasSurroundings ? 'low' : 'none',
      evidenceKey: hasSurroundings ? 'surroundings' : 'surroundingsMissing',
      evidenceParams: { residential, workplaces, radius },
    },
    transport: {
      value: clampScore((100 * (busStops + METRO_STOP_WEIGHT * metro)) / (profile.transportTarget * areaScale)),
      sourceKey: 'osm',
      confidence: 'medium',
      evidenceKey: 'transport',
      evidenceParams: { busStops, metro, radius },
    },
    rent: {
      value: hasRent ? rentScore : null,
      sourceKey: 'user',
      confidence: hasRent ? 'high' : 'none',
      evidenceKey: hasRent ? 'rent' : 'rentMissing',
      evidenceParams: hasRent ? { rent: rentGel, budget: budgetGel, ratio: Math.round(rentRatio * 100) } : {},
    },
    on_site: {
      value: onSiteParts.length > 0 ? clampScore(onSiteParts.reduce((a, b) => a + b, 0) / onSiteParts.length) : null,
      sourceKey: 'siteVisit',
      confidence: onSiteParts.length > 0 ? 'high' : 'none',
      evidenceKey: onSiteParts.length > 0 ? 'onSite' : 'onSiteMissing',
      evidenceParams: {},
    },
  };
}

export function computeFactors(input: ScoringInput): ScoreFactor[] {
  const { weights } = SCORING_PROFILES[input.businessType];
  const drafts = computeDrafts(input);
  const categories = activityCategoryList(input.businessType);

  return (Object.keys(drafts) as ScoreFactorKey[]).map((key) => {
    const draft = drafts[key];
    return {
      key,
      label: EN_SCORE.factors[key],
      weight: weights[key],
      ...draft,
      source: EN_SCORE.sources[draft.sourceKey],
      evidence: formatMessage(EN_SCORE.evidence[draft.evidenceKey], { ...draft.evidenceParams, categories }),
    };
  });
}

/** S = Σ(wᵢ·sᵢ) / Σ(wᵢ) over factors with data. Missing factors are excluded, never counted as 0. */
export function computeScore(factors: ScoreFactor[]): Pick<LocationScore, 'total' | 'coverage'> {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const withData = factors.filter((factor) => factor.value !== null);
  const dataWeight = withData.reduce((sum, factor) => sum + factor.weight, 0);
  if (dataWeight === 0) return { total: null, coverage: 0 };

  const weighted = withData.reduce((sum, factor) => sum + factor.weight * (factor.value ?? 0), 0);
  return {
    total: Math.round(weighted / dataWeight),
    coverage: Math.round((100 * dataWeight) / totalWeight),
  };
}

export function scoreLocation(input: ScoringInput): LocationScore {
  const factors = computeFactors(input);
  return { businessType: input.businessType, radiusM: input.radiusM, ...computeScore(factors), factors };
}
