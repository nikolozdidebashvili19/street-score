import mongoose, { Schema, InferSchemaType } from 'mongoose';

import { BUSINESS_TYPE_KEYS } from '@/shared/const/business-types.const';
import { EVIDENCE_KEYS, SCORE_FACTOR_KEYS, SCORE_SOURCE_KEYS } from '@/shared/const/scoring.const';

const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const ObservationSchema = new Schema(
  {
    type: { type: String, enum: ['pedestrian_count', 'visibility', 'opening_hours_note', 'free_text'], required: true },
    value: { type: String, required: true },
    notedAt: { type: Date, default: Date.now, required: true },
  },
  { _id: false }
);

const ScoreFactorSchema = new Schema(
  {
    key: { type: String, enum: SCORE_FACTOR_KEYS, required: true },
    label: { type: String, required: true },
    weight: { type: Number, required: true },
    value: { type: Number, default: null },
    source: { type: String, required: true },
    confidence: { type: String, enum: ['high', 'medium', 'low', 'none'], required: true },
    evidence: { type: String, default: '' },
    sourceKey: { type: String, enum: SCORE_SOURCE_KEYS },
    evidenceKey: { type: String, enum: EVIDENCE_KEYS },
    evidenceParams: { type: Map, of: Number, default: {} },
  },
  { _id: false }
);

const ScoreSnapshotSchema = new Schema(
  {
    total: { type: Number, default: null },
    coverage: { type: Number, required: true },
    factors: { type: [ScoreFactorSchema], default: [] },
    counts: { type: Map, of: Number, default: {} },
    computedAt: { type: Date, default: Date.now, required: true },
  },
  { _id: false }
);

const CandidateLocationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, required: true },
    address: { type: String, default: '' },
    businessType: { type: String, enum: BUSINESS_TYPE_KEYS, required: true },
    radiusM: { type: Number, required: true },
    location: { type: PointSchema, required: true },
    rentGel: { type: Number, default: null },
    budgetGel: { type: Number, default: null },
    observations: { type: [ObservationSchema], default: [] },
    score: { type: ScoreSnapshotSchema, default: null },
  },
  { timestamps: true }
);

CandidateLocationSchema.index({ location: '2dsphere' });

export type CandidateLocationDocument = InferSchemaType<typeof CandidateLocationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CandidateLocationModel =
  mongoose.models.CandidateLocation || mongoose.model('CandidateLocation', CandidateLocationSchema);
