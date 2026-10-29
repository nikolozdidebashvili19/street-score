import { type BusinessType } from '@/shared/const/business-types.const';
import { type LngLat } from '@/shared/utils/geo';

export type Branch = {
  id: string;
  label: string;
  address: string;
  lng: number;
  lat: number;
  createdAt: string;
};

export type BranchCreate = {
  userId: string;
  label: string;
  address: string;
  location: { type: 'Point'; coordinates: [number, number] };
};

/** A point already in (or proposed for) the network. */
export type NetworkPoint = LngLat & { label: string };

export type NetworkFit = {
  /** Location score 0–100 from mapped data, or null when nothing is mapped. */
  fit: number | null;
  /** Share (0–100) of this site's catchment already covered by the rest of the network. */
  overlap: number;
  /** fit × (1 − overlap): the new demand a branch here would add. */
  expansionScore: number | null;
  nearestM: number | null;
  nearestLabel: string | null;
};

export type ExpansionSite = LngLat &
  NetworkFit & {
    rank: number;
    competitors: number;
  };

export type BranchAssessment = Branch & NetworkFit;

export type ShortlistAssessment = LngLat &
  NetworkFit & {
    id: string;
    label: string;
    address: string;
  };

export type ExpansionPlan = {
  businessType: BusinessType;
  radiusM: number;
  branches: BranchAssessment[];
  sites: ExpansionSite[];
  shortlist: ShortlistAssessment[];
  cellsEvaluated: number;
};

export type DraftBranch = LngLat & {
  address: string;
  /** True when the pin came from address search, so the map should fly to it. */
  fromSearch: boolean;
};

export type ExpansionState = {
  branches: Branch[];
  draft: DraftBranch | null;
  /** A spot the user asked to see; the map flies to it. */
  focus: LngLat | null;
  businessType: BusinessType;
  radiusM: number;
  count: number;
  plan: ExpansionPlan | null;
  loading: boolean;
  planning: boolean;
  error: string | null;
};

export type ExpansionActions = {
  setBranches: (branches: Branch[]) => void;
  addBranch: (branch: Branch) => void;
  removeBranch: (id: string) => void;
  setDraft: (draft: DraftBranch | null) => void;
  setFocus: (focus: LngLat | null) => void;
  setBusinessType: (businessType: BusinessType) => void;
  setRadius: (radiusM: number) => void;
  setCount: (count: number) => void;
  setPlan: (plan: ExpansionPlan | null) => void;
  setLoading: (loading: boolean) => void;
  setPlanning: (planning: boolean) => void;
  setError: (error: string | null) => void;
};

export type ExpansionStore = ExpansionState & ExpansionActions;
