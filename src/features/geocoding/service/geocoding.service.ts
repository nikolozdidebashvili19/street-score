import { geocodeCacheRepository } from '@/features/geocoding/repository/geocode-cache.repository';
import { type GeocodeType } from '@/features/geocoding/validations/geocoding.validation';
import { nominatim, type GeocodeResult } from '@/shared/lib/nominatim';
import { type ServiceResult } from '@/shared/types/common';

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function geocodeService(input: GeocodeType): Promise<ServiceResult<GeocodeResult[]>> {
  const query = normalizeQuery(input.query);

  const cached = await geocodeCacheRepository.findByQuery(query);
  if (cached) return { data: cached.results, status: 200 };

  const results = await nominatim.search(query);
  await geocodeCacheRepository.save(query, results);
  return { data: results, status: 200 };
}
