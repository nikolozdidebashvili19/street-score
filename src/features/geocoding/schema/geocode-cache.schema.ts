import mongoose, { Schema, InferSchemaType } from 'mongoose';

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;

const GeocodeResultSchema = new Schema(
  {
    label: { type: String, required: true },
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
  },
  { _id: false }
);

const GeocodeCacheSchema = new Schema(
  {
    query: { type: String, required: true, unique: true },
    results: { type: [GeocodeResultSchema], default: [] },
  },
  { timestamps: true }
);

GeocodeCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: CACHE_TTL_SECONDS });

export type GeocodeCacheDocument = InferSchemaType<typeof GeocodeCacheSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GeocodeCacheModel =
  mongoose.models.GeocodeCache || mongoose.model('GeocodeCache', GeocodeCacheSchema);
