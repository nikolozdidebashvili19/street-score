import { placeRepository } from '@/features/places/repository/place.repository';
import { type NearbyPlace, type PlaceNearRow } from '@/features/places/types/place.types';
import { type NearbyQueryType } from '@/features/places/validations/place.validation';
import { PLACE_CATEGORY_KEYS, type PlaceCategory } from '@/shared/const/places.const';
import { type ServiceResult } from '@/shared/types/common';

const DEFAULT_NEARBY_LIMIT = 500;

export function toNearbyPlace(row: PlaceNearRow): NearbyPlace {
  const [lng, lat] = row.location.coordinates;
  return {
    id: row._id.toString(),
    osmId: row.osmId,
    name: row.name ?? '',
    nameKa: row.nameKa ?? '',
    category: row.category as PlaceCategory,
    lng,
    lat,
    distanceM: Math.round(row.distanceM),
  };
}

export async function getNearbyPlacesService(query: NearbyQueryType): Promise<ServiceResult<NearbyPlace[]>> {
  const rows = await placeRepository.findNear({
    lng: query.lng,
    lat: query.lat,
    radiusM: query.radiusM,
    categories: query.categories ?? [...PLACE_CATEGORY_KEYS],
    limit: query.limit ?? DEFAULT_NEARBY_LIMIT,
  });

  return { data: rows.map(toNearbyPlace), status: 200 };
}
