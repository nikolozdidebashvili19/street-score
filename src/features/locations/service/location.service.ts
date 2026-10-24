import { candidateLocationRepository } from '@/features/locations/repository/candidate-location.repository';
import { type CandidateLocationDocument } from '@/features/locations/schema/candidate-location.schema';
import { type CandidateLocation } from '@/features/locations/types/location.types';
import { type CreateLocationType } from '@/features/locations/validations/location.validation';
import { scoreLocationService } from '@/features/scoring/service/score-location.service';
import { type CategoryCounts, type ScoredLocation, type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { type BusinessType } from '@/shared/const/business-types.const';
import { type ServiceResult } from '@/shared/types/common';

/** `.lean()` returns Mongoose maps as plain objects, while `toObject()` keeps them as Map instances. */
function toPlainRecord(value: Map<string, number> | Record<string, number> | null | undefined): Record<string, number> {
  if (value instanceof Map) return Object.fromEntries(value);
  return value ?? {};
}

type StoredFactor = NonNullable<CandidateLocationDocument['score']>['factors'][number];

function toFactors(factors: StoredFactor[]): ScoreFactor[] {
  return factors.map((factor) => ({
    key: factor.key,
    label: factor.label,
    weight: factor.weight,
    value: factor.value ?? null,
    source: factor.source,
    confidence: factor.confidence,
    evidence: factor.evidence,
    sourceKey: factor.sourceKey ?? undefined,
    evidenceKey: factor.evidenceKey ?? undefined,
    evidenceParams: toPlainRecord(factor.evidenceParams),
  }));
}

export function toCandidateLocation(doc: CandidateLocationDocument): CandidateLocation {
  const businessType = doc.businessType as BusinessType;
  const [lng, lat] = doc.location.coordinates;
  return {
    id: doc._id.toString(),
    label: doc.label,
    address: doc.address ?? '',
    businessType,
    radiusM: doc.radiusM,
    lng,
    lat,
    rentGel: doc.rentGel ?? null,
    budgetGel: doc.budgetGel ?? null,
    score: doc.score
      ? {
        businessType,
        radiusM: doc.radiusM,
        total: doc.score.total ?? null,
        coverage: doc.score.coverage,
        factors: toFactors(doc.score.factors),
      }
      : null,
    counts: toPlainRecord(doc.score?.counts) as CategoryCounts,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function createLocationService(
  userId: string,
  input: CreateLocationType
): Promise<ServiceResult<CandidateLocation>> {
  const scored = await scoreLocationService(input);
  const { score, counts } = scored.data as ScoredLocation;

  const doc = await candidateLocationRepository.create({
    userId,
    label: input.label,
    address: input.address,
    businessType: input.businessType,
    radiusM: input.radiusM,
    location: { type: 'Point', coordinates: [input.lng, input.lat] },
    rentGel: input.rentGel ?? null,
    budgetGel: input.budgetGel ?? null,
    score: { total: score.total, coverage: score.coverage, factors: score.factors, counts, computedAt: new Date() },
  });

  return { data: toCandidateLocation(doc), status: 201 };
}

export async function listLocationsService(userId: string): Promise<ServiceResult<CandidateLocation[]>> {
  const docs = await candidateLocationRepository.findByUser(userId);
  return { data: docs.map(toCandidateLocation), status: 200 };
}

export async function deleteLocationService(userId: string, id: string): Promise<ServiceResult<{ message: string }>> {
  const deleted = await candidateLocationRepository.deleteByIdForUser(id, userId);
  if (!deleted) return { data: { error: 'NOT_FOUND' }, status: 404 };
  return { data: { message: 'Location deleted' }, status: 200 };
}
