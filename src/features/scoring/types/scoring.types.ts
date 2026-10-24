import { type BusinessType } from '@/shared/const/business-types.const';
import { type BaselineVerifyKey } from '@/shared/const/explanations.const';
import { type PlaceCategory } from '@/shared/const/places.const';
import { type EvidenceKey, type ScoreFactorKey, type ScoreSourceKey } from '@/shared/const/scoring.const';

export type ScoreConfidence = 'high' | 'medium' | 'low' | 'none';

export type ScoreFactor = {
  key: ScoreFactorKey;
  /** English label, kept for API consumers and older snapshots; the UI translates by `key`. */
  label: string;
  weight: number;
  /** Normalized 0–100, or null when there is no reliable data for this factor. */
  value: number | null;
  /** English source/evidence text; the UI renders `sourceKey` / `evidenceKey` + params instead. */
  source: string;
  confidence: ScoreConfidence;
  evidence: string;
  /** Absent on snapshots saved before translations existed. */
  sourceKey?: ScoreSourceKey;
  evidenceKey?: EvidenceKey;
  evidenceParams?: Record<string, number>;
};

export type LocationScore = {
  businessType: BusinessType;
  radiusM: number;
  /** Weighted mean over factors with data; null when no factor has data. */
  total: number | null;
  /** Percentage of total weight backed by data. */
  coverage: number;
  factors: ScoreFactor[];
};

export type ExplanationItem = {
  factorKey: ScoreFactorKey;
  factor: ScoreFactor;
};

export type VerifyItem =
  | { kind: 'missing'; factorKey: ScoreFactorKey }
  | { kind: 'baseline'; key: BaselineVerifyKey };

export type LocationExplanation = {
  advantages: ExplanationItem[];
  risks: ExplanationItem[];
  missing: ExplanationItem[];
  /** What to check before signing a lease — missing-data items first, then the baseline checklist. */
  verify: VerifyItem[];
};

export type CategoryCounts = Partial<Record<PlaceCategory, number>>;

export type ScoredLocation = {
  score: LocationScore;
  counts: CategoryCounts;
};

export type SiteObservationsInput = {
  pedestrianPer15Min?: number | null;
  /** 1 (hidden) – 5 (highly visible). */
  visibility?: number | null;
};

export type ScoringInput = {
  businessType: BusinessType;
  radiusM: number;
  counts: CategoryCounts;
  rentGel?: number | null;
  budgetGel?: number | null;
  observations?: SiteObservationsInput;
};
