import { BranchDocument, BranchModel } from '@/features/expansion/schema/branch.schema';
import { type BranchCreate } from '@/features/expansion/types/expansion.types';
import { mongo } from '@/shared/lib/mongo';

export const branchRepository = {
  async create(data: BranchCreate): Promise<BranchDocument> {
    await mongo.connect();
    const doc = await BranchModel.create(data);
    return doc.toObject() as BranchDocument;
  },

  async findByUser(userId: string): Promise<BranchDocument[]> {
    await mongo.connect();
    return BranchModel.find({ userId }).sort({ createdAt: 1 }).lean<BranchDocument[]>().exec();
  },

  async countByUser(userId: string): Promise<number> {
    await mongo.connect();
    return BranchModel.countDocuments({ userId }).exec();
  },

  async deleteByIdForUser(id: string, userId: string): Promise<boolean> {
    await mongo.connect();
    const result = await BranchModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  },
};
