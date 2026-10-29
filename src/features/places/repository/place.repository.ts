import { PlaceModel } from '@/features/places/schema/place.schema';
import {
  type BulkUpsertResult,
  type CategoryCountRow,
  type GridCountRow,
  type GridQuery,
  type NearbyQuery,
  type PlaceNearRow,
  type PlaceUpsert,
} from '@/features/places/types/place.types';
import { mongo } from '@/shared/lib/mongo';

export const placeRepository = {
  async findNear({ lng, lat, radiusM, categories, limit }: NearbyQuery): Promise<PlaceNearRow[]> {
    await mongo.connect();
    return PlaceModel.aggregate<PlaceNearRow>([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          key: 'location',
          distanceField: 'distanceM',
          maxDistance: radiusM,
          spherical: true,
          query: { category: { $in: categories } },
        },
      },
      { $limit: limit },
      { $project: { tags: 0 } },
    ]).exec();
  },

  async countByCategoryNear({ lng, lat, radiusM }: Omit<NearbyQuery, 'categories' | 'limit'>): Promise<CategoryCountRow[]> {
    await mongo.connect();
    return PlaceModel.aggregate<CategoryCountRow>([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          key: 'location',
          distanceField: 'distanceM',
          maxDistance: radiusM,
          spherical: true,
        },
      },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]).exec();
  },

  /** Counts places per category per grid cell inside the bbox; cell (0, 0) starts at the bbox's south-west corner. */
  async countByCategoryInGrid({ bbox, stepLng, stepLat }: GridQuery): Promise<GridCountRow[]> {
    await mongo.connect();
    const [west, south, east, north] = bbox;
    return PlaceModel.aggregate<GridCountRow>([
      {
        $match: {
          location: {
            $geoWithin: {
              $geometry: {
                type: 'Polygon',
                coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            cx: { $floor: { $divide: [{ $subtract: [{ $arrayElemAt: ['$location.coordinates', 0] }, west] }, stepLng] } },
            cy: { $floor: { $divide: [{ $subtract: [{ $arrayElemAt: ['$location.coordinates', 1] }, south] }, stepLat] } },
            category: '$category',
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();
  },

  async bulkUpsert(places: PlaceUpsert[]): Promise<BulkUpsertResult> {
    await mongo.connect();
    const result = await PlaceModel.bulkWrite(
      places.map((place) => ({
        updateOne: {
          filter: { osmId: place.osmId },
          update: { $set: place },
          upsert: true,
        },
      })),
      { ordered: false }
    );
    return { upserted: result.upsertedCount, modified: result.modifiedCount };
  },

  async syncIndexes(): Promise<void> {
    await mongo.connect();
    await PlaceModel.syncIndexes();
  },
};
