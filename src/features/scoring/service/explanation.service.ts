import { type LocationExplanation, type LocationScore, type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { ADVANTAGE_THRESHOLD, BASELINE_VERIFY_KEYS, RISK_THRESHOLD } from '@/shared/const/explanations.const';

function byWeightDesc(a: ScoreFactor, b: ScoreFactor) {
  return b.weight - a.weight;
}

function toItem(factor: ScoreFactor) {
  return { factorKey: factor.key, factor };
}

/**
 * Builds findings from the score factors only. Each item is tied to a factor (and so to its
 * source); the UI turns them into sentences per language. Nothing here produces or changes a number.
 */
export function explainScore(score: LocationScore): LocationExplanation {
  const withData = score.factors.filter((factor) => factor.value !== null);
  const missing = score.factors.filter((factor) => factor.value === null).sort(byWeightDesc);

  const advantages = withData
    .filter((factor) => (factor.value ?? 0) >= ADVANTAGE_THRESHOLD)
    .sort((a, b) => (b.value ?? 0) * b.weight - (a.value ?? 0) * a.weight)
    .map(toItem);

  const risks = withData
    .filter((factor) => (factor.value ?? 0) <= RISK_THRESHOLD)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0) || b.weight - a.weight)
    .map(toItem);

  return {
    advantages,
    risks,
    missing: missing.map(toItem),
    verify: [
      ...missing.map((factor) => ({ kind: 'missing' as const, factorKey: factor.key })),
      ...BASELINE_VERIFY_KEYS.map((key) => ({ kind: 'baseline' as const, key })),
    ],
  };
}
