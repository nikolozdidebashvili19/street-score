import {
  CandidateLocationDocument,
  CandidateLocationModel,
} from '@/features/locations/schema/candidate-location.schema';
import { type CandidateLocationCreate } from '@/features/locations/types/location.types';
import { mongo } from '@/shared/lib/mongo';

export const candidateLocationRepository = {
  async create(data: CandidateLocationCreate): Promise<CandidateLocationDocument> {
    await mongo.connect();
    const doc = await CandidateLocationModel.create(data);
    return doc.toObject() as CandidateLocationDocument;
  },

  async findByUser(userId: string): Promise<CandidateLocationDocument[]> {
    await mongo.connect();
    return CandidateLocationModel.find({ userId }).sort({ createdAt: -1 }).lean<CandidateLocationDocument[]>().exec();
  },

  async deleteByIdForUser(id: string, userId: string): Promise<boolean> {
    await mongo.connect();
    const result = await CandidateLocationModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  },
};
