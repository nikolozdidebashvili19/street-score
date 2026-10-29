import { branchRepository } from '@/features/expansion/repository/branch.repository';
import { toBranch } from '@/features/expansion/service/branch.service';
import {
  assessAgainstNetwork,
  createGridScorer,
  gridQueryFor,
  pickSites,
} from '@/features/expansion/service/expansion.service';
import { type ExpansionPlan, type NetworkPoint } from '@/features/expansion/types/expansion.types';
import { type ExpansionPlanRequestType } from '@/features/expansion/validations/expansion.validation';
import { candidateLocationRepository } from '@/features/locations/repository/candidate-location.repository';
import { toCandidateLocation } from '@/features/locations/service/location.service';
import { placeRepository } from '@/features/places/repository/place.repository';
import { EXPANSION_CELL_SIZE_M, EXPANSION_SEARCH_BBOX } from '@/shared/const/expansion.const';
import { type ServiceResult } from '@/shared/types/common';

export async function planExpansionService(
  userId: string,
  input: ExpansionPlanRequestType
): Promise<ServiceResult<ExpansionPlan>> {
  const query = gridQueryFor(EXPANSION_SEARCH_BBOX, EXPANSION_CELL_SIZE_M);
  const [branchDocs, rows, savedDocs] = await Promise.all([
    branchRepository.findByUser(userId),
    placeRepository.countByCategoryInGrid(query),
    candidateLocationRepository.findByUser(userId),
  ]);

  const { businessType, radiusM, count } = input;
  const scorer = createGridScorer({ rows, query, cellSizeM: EXPANSION_CELL_SIZE_M, businessType, radiusM });
  const branches = branchDocs.map(toBranch);
  const network: NetworkPoint[] = branches.map(({ lng, lat, label }) => ({ lng, lat, label }));

  const assessedBranches = branches.map((branch, index) => ({
    ...branch,
    ...assessAgainstNetwork(
      branch,
      scorer.scorePoint(branch).fit,
      network.filter((_, other) => other !== index),
      radiusM
    ),
  }));

  // Saved scores are reused (they may include rent and site visits); only the network fit is new.
  const shortlist = savedDocs
    .map(toCandidateLocation)
    .filter((location) => location.businessType === businessType)
    .map((location) => ({
      id: location.id,
      label: location.label,
      address: location.address,
      lng: location.lng,
      lat: location.lat,
      ...assessAgainstNetwork(location, location.score?.total ?? null, network, radiusM),
    }))
    .sort((a, b) => (b.expansionScore ?? -1) - (a.expansionScore ?? -1));

  return {
    data: {
      businessType,
      radiusM,
      branches: assessedBranches,
      sites: pickSites(scorer.candidates, network, radiusM, count),
      shortlist,
      cellsEvaluated: scorer.candidates.length,
    },
    status: 200,
  };
}
