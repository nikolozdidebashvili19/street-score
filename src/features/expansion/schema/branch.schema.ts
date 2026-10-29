import mongoose, { Schema, InferSchemaType } from 'mongoose';

const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

/** A branch the business already operates — the network new sites must not cannibalise. */
const BranchSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, required: true },
    address: { type: String, default: '' },
    location: { type: PointSchema, required: true },
  },
  { timestamps: true }
);

export type BranchDocument = InferSchemaType<typeof BranchSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BranchModel = mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
