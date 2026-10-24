import { type PlaceDocument } from '@/features/places/schema/place.schema';
import { type PlaceCategory } from '@/shared/const/places.const';

export type NearbyPlace = {
  id: string;
  osmId: string;
  name: string;
  nameKa: string;
  category: PlaceCategory;
  lng: number;
  lat: number;
  distanceM: number;
};

export type NearbyQuery = {
  lng: number;
  lat: number;
  radiusM: number;
  categories: PlaceCategory[];
  limit: number;
};

export type PlaceNearRow = Omit<PlaceDocument, 'tags'> & { distanceM: number };

export type PlaceUpsert = {
  osmId: string;
  name: string;
  nameKa: string;
  category: PlaceCategory;
  location: { type: 'Point'; coordinates: [number, number] };
  tags: Record<string, string>;
  source: 'osm';
};

export type CategoryCountRow = {
  _id: PlaceCategory;
  count: number;
};

export type BulkUpsertResult = {
  upserted: number;
  modified: number;
};
