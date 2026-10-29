'use client';
import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { ScoreExplanation } from '@/features/scoring/components/score-explanation';
import { explainScore } from '@/features/scoring/service/explanation.service';
import { ScoreRing } from '@/shared/components/ui/score-ring';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { useI18n } from '@/shared/hooks/use-i18n';

const SUMMARY_ITEMS = 2;

/** The at-a-glance answer: score, competitor count, and the top good / watch-out points. */
export const SiteOverview = () => {
  const { result, businessType } = useExplorerStore();
  const { t } = useI18n();
  if (!result) return null;

  const { competitorCategories } = BUSINESS_TYPES[businessType];
  // Apartments have no competitor category, so there is no count to show.
  const hasCompetitors = competitorCategories.length > 0;
  const competitorCount = competitorCategories.reduce(
    (sum, category) => sum + (result.counts[category] ?? 0),
    0
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <ScoreRing value={result.score.total} size="lg" />
        <dl className="flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-muted-foreground">{t.score.title}</dt>
            <dd className="font-mono text-xs text-muted-foreground">
              {result.score.coverage}% {t.score.backedByData}
            </dd>
          </div>
          {hasCompetitors && (
            <div>
              <dd className="font-heading text-2xl leading-none text-brick">{competitorCount}</dd>
              <dt className="text-muted-foreground">{t.nearby.competitorsMapped}</dt>
            </div>
          )}
        </dl>
      </div>

      <ScoreExplanation score={result.score} explanation={explainScore(result.score)} maxItems={SUMMARY_ITEMS} showTitles={false} />
    </div>
  );
};
