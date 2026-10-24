import { placeRepository } from '@/features/places/repository/place.repository';
import { scoreLocation } from '@/features/scoring/service/scoring.service';
import { type CategoryCounts, type ScoredLocation } from '@/features/scoring/types/scoring.types';
import { type ScoreRequestType } from '@/features/scoring/validations/scoring.validation';
import { type ServiceResult } from '@/shared/types/common';

export async function getCategoryCounts(lng: number, lat: number, radiusM: number): Promise<CategoryCounts> {
  const rows = await placeRepository.countByCategoryNear({ lng, lat, radiusM });
  return Object.fromEntries(rows.map((row) => [row._id, row.count]));
}

export async function scoreLocationService(input: ScoreRequestType): Promise<ServiceResult<ScoredLocation>> {
  const counts = await getCategoryCounts(input.lng, input.lat, input.radiusM);
  const score = scoreLocation({
    businessType: input.businessType,
    radiusM: input.radiusM,
    counts,
    rentGel: input.rentGel,
    budgetGel: input.budgetGel,
    observations: { pedestrianPer15Min: input.pedestrianPer15Min, visibility: input.visibility },
  });

  return { data: { score, counts }, status: 200 };
}
