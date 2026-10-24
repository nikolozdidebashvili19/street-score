import mongoose, { Schema, InferSchemaType } from 'mongoose';

import { PLACE_CATEGORY_KEYS } from '@/shared/const/places.const';

const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const PlaceSchema = new Schema(
  {
    osmId: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    nameKa: { type: String, default: '' },
    category: { type: String, enum: PLACE_CATEGORY_KEYS, required: true },
    location: { type: PointSchema, required: true },
    tags: { type: Map, of: String, default: {} },
    source: { type: String, enum: ['osm'], default: 'osm', required: true },
  },
  { timestamps: true }
);

PlaceSchema.index({ location: '2dsphere', category: 1 });

export type PlaceDocument = InferSchemaType<typeof PlaceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const PlaceModel =
  mongoose.models.Place || mongoose.model('Place', PlaceSchema);
