'use client';
import { CircleAlert, CircleCheck, CircleHelp, Square, type LucideIcon } from 'lucide-react';

import { describeFactor, explainTextFor } from '@/features/scoring/service/factor-text.service';
import {
  type ExplanationItem,
  type LocationExplanation,
  type LocationScore,
  type VerifyItem,
} from '@/features/scoring/types/scoring.types';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

export type ExplanationSection = 'advantages' | 'risks' | 'missing' | 'verify';

type Line = { key: string; text: string };

const SECTION_ICON: Record<ExplanationSection, { icon: LucideIcon; className: string }> = {
  advantages: { icon: CircleCheck, className: 'text-positive' },
  risks: { icon: CircleAlert, className: 'text-brick' },
  missing: { icon: CircleHelp, className: 'text-muted-foreground' },
  verify: { icon: Square, className: 'text-muted-foreground' },
};

type ScoreExplanationProps = {
  score: LocationScore;
  explanation: LocationExplanation;
  sections?: ExplanationSection[];
  /** Cap per section, to keep summaries short. */
  maxItems?: number;
  showTitles?: boolean;
};

export const ScoreExplanation = ({
  score,
  explanation,
  sections = ['advantages', 'risks'],
  maxItems,
  showTitles = true,
}: ScoreExplanationProps) => {
  const { t, locale, format } = useI18n();
  const explain = explainTextFor(t, score.businessType);

  const factorLines = (items: ExplanationItem[], texts: Record<ExplanationItem['factorKey'], string>): Line[] =>
    items.map((item) => ({ key: item.factorKey, text: texts[item.factorKey] }));

  const verifyText = (item: VerifyItem) =>
    item.kind === 'missing' ? explain.missingVerify[item.factorKey] : explain.baseline[item.key];

  const linesFor: Record<ExplanationSection, () => Line[]> = {
    advantages: () => factorLines(explanation.advantages, explain.advantages),
    risks: () => factorLines(explanation.risks, explain.risks),
    missing: () =>
      explanation.missing.map((item) => ({
        key: item.factorKey,
        text: format(explain.missingItem, { label: describeFactor(item.factor, score.businessType, locale).label }),
      })),
    verify: () =>
      explanation.verify.map((item) => ({ key: item.kind === 'missing' ? item.factorKey : item.key, text: verifyText(item) })),
  };

  const titles: Record<ExplanationSection, string> = {
    advantages: explain.advantagesTitle,
    risks: explain.risksTitle,
    missing: explain.missingTitle,
    verify: explain.verifyTitle,
  };

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => {
        const lines = linesFor[section]().slice(0, maxItems);
        if (lines.length === 0) return null;
        const { icon: Icon, className } = SECTION_ICON[section];

        return (
          <div key={section} className="flex flex-col gap-2">
            {showTitles && <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{titles[section]}</p>}
            <ul className="flex flex-col gap-1.5">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-2 text-sm">
                  <Icon className={cn('mt-0.5 size-4 shrink-0', className)} />
                  <span>{line.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
