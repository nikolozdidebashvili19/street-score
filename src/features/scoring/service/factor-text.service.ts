import { activityCategoryList } from '@/features/scoring/service/scoring.service';
import { type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { type BusinessType } from '@/shared/const/business-types.const';
import { DICTIONARIES } from '@/shared/const/dictionaries.const';
import { type Locale } from '@/shared/const/i18n.const';
import { formatMessage } from '@/shared/utils/i18n';

export type FactorText = {
  label: string;
  source: string;
  evidence: string;
};

/**
 * Renders a factor in the requested language from its keys and numeric params.
 * Snapshots saved before translations existed have no keys and fall back to their English text.
 */
export function describeFactor(factor: ScoreFactor, businessType: BusinessType, locale: Locale): FactorText {
  const score = DICTIONARIES[locale].score;
  const categories = activityCategoryList(businessType, locale === 'ka');

  return {
    label: score.factors[factor.key],
    source: factor.sourceKey ? score.sources[factor.sourceKey] : factor.source,
    evidence: factor.evidenceKey
      ? formatMessage(score.evidence[factor.evidenceKey], { ...factor.evidenceParams, categories })
      : factor.evidence,
  };
}
