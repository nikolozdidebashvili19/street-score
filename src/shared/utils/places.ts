import { BUSINESS_TYPES, type BusinessType } from '@/shared/const/business-types.const';
import { PLACE_CATEGORIES, type PlaceCategory } from '@/shared/const/places.const';

export type PlaceRole = 'competitor' | 'activity' | 'transport' | 'context';

export function getPlaceRole(category: PlaceCategory, businessType: BusinessType): PlaceRole {
  const business = BUSINESS_TYPES[businessType];
  if (business.competitorCategories.includes(category)) return 'competitor';
  if (business.activityCategories.includes(category)) return 'activity';
  if (PLACE_CATEGORIES[category].group === 'transport') return 'transport';
  return 'context';
}
