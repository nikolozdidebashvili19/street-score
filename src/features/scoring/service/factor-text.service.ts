import { activityCategoryList } from '@/features/scoring/service/scoring.service';
import { type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { type BusinessType } from '@/shared/const/business-types.const';
import { DICTIONARIES, type Dictionary } from '@/shared/const/dictionaries.const';
import { ADVANTAGE_THRESHOLD, RISK_THRESHOLD } from '@/shared/const/explanations.const';
import { type Locale } from '@/shared/const/i18n.const';
import { formatMessage } from '@/shared/utils/i18n';
import { isPropertyType } from '@/shared/utils/places';

export type FactorVerdict = 'good' | 'okay' | 'weak' | 'none';

export type FactorText = {
  label: string;
  /** The plain question this factor answers, e.g. "Is it easy to get here by bus or metro?" */
  question: string;
  source: string;
  evidence: string;
};

/** One word instead of a number: the same thresholds that decide "Good" and "Watch out". */
export function factorVerdict(value: number | null): FactorVerdict {
  if (value === null) return 'none';
  if (value >= ADVANTAGE_THRESHOLD) return 'good';
  if (value <= RISK_THRESHOLD) return 'weak';
  return 'okay';
}

/** Score wording for a business type: real estate swaps in its own lines where they differ. */
export function scoreTextFor(t: Dictionary, businessType: BusinessType) {
  if (!isPropertyType(businessType)) return t.score;
  const { property } = t.score;
  return {
    ...t.score,
    factors: { ...t.score.factors, ...property.factors },
    questions: { ...t.score.questions, ...property.questions },
    evidence: { ...t.score.evidence, ...property.evidence },
  };
}

/** Explanation wording for a business type, with the same real estate overrides. */
export function explainTextFor(t: Dictionary, businessType: BusinessType) {
  if (!isPropertyType(businessType)) return t.explain;
  const { property } = t.explain;
  return {
    ...t.explain,
    advantages: { ...t.explain.advantages, ...property.advantages },
    risks: { ...t.explain.risks, ...property.risks },
    missingVerify: { ...t.explain.missingVerify, ...property.missingVerify },
  };
}

/**
 * Renders a factor in the requested language from its keys and numeric params.
 * Snapshots saved before translations existed have no keys and fall back to their English text.
 */
export function describeFactor(factor: ScoreFactor, businessType: BusinessType, locale: Locale): FactorText {
  const score = scoreTextFor(DICTIONARIES[locale], businessType);
  const categories = activityCategoryList(businessType, locale === 'ka');

  return {
    label: score.factors[factor.key],
    question: score.questions[factor.key],
    source: factor.sourceKey ? score.sources[factor.sourceKey] : factor.source,
    evidence: factor.evidenceKey
      ? formatMessage(score.evidence[factor.evidenceKey], { ...factor.evidenceParams, categories })
      : factor.evidence,
  };
}
