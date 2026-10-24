import { placeRepository } from '@/features/places/repository/place.repository';
import { type PlaceUpsert } from '@/features/places/types/place.types';
import { IMPORT_AREAS, OSM_TAG_RULES } from '@/shared/const/places.const';
import { overpass, type OverpassElement } from '@/shared/lib/overpass';
import { type ServiceResult } from '@/shared/types/common';
import { osmTagsToCategory } from '@/shared/utils/osm';

const UPSERT_BATCH_SIZE = 1000;

export type ImportSummary = {
  area: string;
  fetched: number;
  skipped: number;
  upserted: number;
  modified: number;
};

export function elementToPlace(element: OverpassElement): PlaceUpsert | null {
  const tags = element.tags ?? {};
  const category = osmTagsToCategory(tags);
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (!category || lat === undefined || lon === undefined) return null;

  return {
    osmId: `${element.type}/${element.id}`,
    name: tags.name ?? tags['name:en'] ?? '',
    nameKa: tags['name:ka'] ?? '',
    category,
    location: { type: 'Point', coordinates: [lon, lat] },
    tags,
    source: 'osm',
  };
}

export async function importPlacesService(areaKey: string): Promise<ServiceResult<ImportSummary>> {
  const area = IMPORT_AREAS[areaKey];
  if (!area) return { data: { error: 'UNKNOWN_AREA' }, status: 400 };

  const elements = await overpass.fetchElements(area.bbox, OSM_TAG_RULES);
  const places = elements
    .map(elementToPlace)
    .filter((place): place is PlaceUpsert => place !== null);

  await placeRepository.syncIndexes();

  let upserted = 0;
  let modified = 0;
  for (let start = 0; start < places.length; start += UPSERT_BATCH_SIZE) {
    const result = await placeRepository.bulkUpsert(places.slice(start, start + UPSERT_BATCH_SIZE));
    upserted += result.upserted;
    modified += result.modified;
  }

  return {
    data: {
      area: area.label,
      fetched: elements.length,
      skipped: elements.length - places.length,
      upserted,
      modified,
    },
    status: 200,
  };
}
