import { type PlaceDocument } from '@/features/places/schema/place.schema';
import { type BoundingBox, type PlaceCategory } from '@/shared/const/places.const';

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

/** A square grid laid over `bbox`; cell (0, 0) starts at its south-west corner. */
export type GridQuery = {
  bbox: BoundingBox;
  stepLng: number;
  stepLat: number;
};

/** How many places of a category fall in grid cell (cx, cy). */
export type GridCountRow = {
  _id: { cx: number; cy: number; category: PlaceCategory };
  count: number;
};

export type BulkUpsertResult = {
  upserted: number;
  modified: number;
};
