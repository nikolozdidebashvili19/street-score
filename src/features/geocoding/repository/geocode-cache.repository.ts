import { GeocodeCacheDocument, GeocodeCacheModel } from '@/features/geocoding/schema/geocode-cache.schema';
import { mongo } from '@/shared/lib/mongo';
import { type GeocodeResult } from '@/shared/lib/nominatim';

export const geocodeCacheRepository = {
  async findByQuery(query: string): Promise<GeocodeCacheDocument | null> {
    await mongo.connect();
    return GeocodeCacheModel.findOne({ query }).lean<GeocodeCacheDocument>().exec();
  },

  async save(query: string, results: GeocodeResult[]): Promise<void> {
    await mongo.connect();
    await GeocodeCacheModel.updateOne({ query }, { $set: { query, results } }, { upsert: true });
  },
};
