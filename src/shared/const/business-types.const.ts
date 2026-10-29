import { type PlaceCategory } from '@/shared/const/places.const';

export const BUSINESS_TYPE_KEYS = [
  'cafe',
  'restaurant',
  'fast_food',
  'bakery',
  'bar',
  'salon',
  'gym',
  'pharmacy',
  'dental',
  'retail',
  'grocery',
  'florist',
  'pet_shop',
  'kindergarten',
  'barbershop',
  'beauty_studio',
  'medical_clinic',
  'supermarket',
  'private_school',
  'apartments',
  'office_building',
] as const;

export type BusinessType = (typeof BUSINESS_TYPE_KEYS)[number];

/** `property` is real estate (what to build or buy), scored on the same map data as shops. */
export type BusinessGroup = 'food' | 'health' | 'retail' | 'education' | 'property';

export const BUSINESS_GROUP_KEYS: BusinessGroup[] = ['food', 'health', 'retail', 'education', 'property'];

export type BusinessTypeMeta = {
  label: string;
  labelKa: string;
  group: BusinessGroup;
  competitorCategories: PlaceCategory[];
  /** Complementary businesses that generate foot traffic for this type. */
  activityCategories: PlaceCategory[];
  defaultRadiusM: number;
};

export const BUSINESS_TYPES: Record<BusinessType, BusinessTypeMeta> = {
  cafe: {
    label: 'Coffee shop / café', labelKa: 'ყავის მაღაზია / კაფე', group: 'food', defaultRadiusM: 500,
    competitorCategories: ['cafe'],
    activityCategories: ['restaurant', 'fast_food', 'bank', 'pharmacy', 'supermarket', 'clothes', 'university'],
  },
  restaurant: {
    label: 'Restaurant', labelKa: 'რესტორანი', group: 'food', defaultRadiusM: 500,
    competitorCategories: ['restaurant'],
    activityCategories: ['cafe', 'bar', 'bank', 'clothes', 'supermarket', 'university', 'healthcare'],
  },
  fast_food: {
    label: 'Fast food / takeaway', labelKa: 'სწრაფი კვება', group: 'food', defaultRadiusM: 500,
    competitorCategories: ['fast_food'],
    activityCategories: ['university', 'school', 'supermarket', 'clothes', 'bank', 'cafe'],
  },
  bakery: {
    label: 'Bakery / pastry shop', labelKa: 'საცხობი / საკონდიტრო', group: 'food', defaultRadiusM: 500,
    competitorCategories: ['bakery'],
    activityCategories: ['supermarket', 'convenience', 'pharmacy', 'cafe', 'school'],
  },
  bar: {
    label: 'Bar / pub', labelKa: 'ბარი / პაბი', group: 'food', defaultRadiusM: 500,
    competitorCategories: ['bar'],
    activityCategories: ['restaurant', 'cafe', 'fast_food', 'university'],
  },
  salon: {
    label: 'Hair & beauty salon', labelKa: 'სილამაზის სალონი', group: 'health', defaultRadiusM: 500,
    competitorCategories: ['hairdresser', 'beauty'],
    activityCategories: ['supermarket', 'convenience', 'pharmacy', 'clothes', 'cafe', 'gym'],
  },
  gym: {
    label: 'Neighbourhood gym', labelKa: 'უბნის სპორტული დარბაზი', group: 'health', defaultRadiusM: 1000,
    competitorCategories: ['gym'],
    activityCategories: ['supermarket', 'convenience', 'cafe', 'pharmacy'],
  },
  pharmacy: {
    label: 'Pharmacy', labelKa: 'აფთიაქი', group: 'health', defaultRadiusM: 500,
    competitorCategories: ['pharmacy'],
    activityCategories: ['healthcare', 'dentist', 'supermarket', 'convenience'],
  },
  dental: {
    label: 'Dental clinic', labelKa: 'სტომატოლოგიური კლინიკა', group: 'health', defaultRadiusM: 1000,
    competitorCategories: ['dentist'],
    activityCategories: ['healthcare', 'pharmacy', 'supermarket', 'bank'],
  },
  retail: {
    label: 'Clothing & small retail', labelKa: 'ტანსაცმელი / მცირე ვაჭრობა', group: 'retail', defaultRadiusM: 500,
    competitorCategories: ['clothes'],
    activityCategories: ['cafe', 'restaurant', 'fast_food', 'bank', 'supermarket', 'beauty'],
  },
  grocery: {
    label: 'Grocery / mini-market', labelKa: 'სასურსათო მაღაზია / მარკეტი', group: 'retail', defaultRadiusM: 500,
    competitorCategories: ['convenience', 'supermarket'],
    activityCategories: ['pharmacy', 'bakery', 'school', 'kindergarten'],
  },
  florist: {
    label: 'Flower shop', labelKa: 'ყვავილების მაღაზია', group: 'retail', defaultRadiusM: 500,
    competitorCategories: ['florist'],
    activityCategories: ['restaurant', 'cafe', 'healthcare', 'supermarket'],
  },
  pet_shop: {
    label: 'Pet shop / vet', labelKa: 'ზოომაღაზია / ვეტერინარი', group: 'retail', defaultRadiusM: 1000,
    competitorCategories: ['pet'],
    activityCategories: ['supermarket', 'convenience', 'pharmacy'],
  },
  kindergarten: {
    label: 'Private kindergarten', labelKa: 'კერძო საბავშვო ბაღი', group: 'education', defaultRadiusM: 1000,
    competitorCategories: ['kindergarten'],
    activityCategories: ['school', 'supermarket', 'pharmacy'],
  },
  barbershop: {
    label: 'Barbershop', labelKa: 'ბარბერშოპი', group: 'health', defaultRadiusM: 500,
    competitorCategories: ['hairdresser'],
    activityCategories: ['supermarket', 'convenience', 'cafe', 'gym', 'clothes'],
  },
  beauty_studio: {
    label: 'Nail & beauty studio', labelKa: 'მანიკურისა და კოსმეტიკის სტუდია', group: 'health', defaultRadiusM: 500,
    competitorCategories: ['beauty'],
    activityCategories: ['clothes', 'cafe', 'supermarket', 'hairdresser', 'gym'],
  },
  medical_clinic: {
    label: 'Medical clinic', labelKa: 'სამედიცინო კლინიკა', group: 'health', defaultRadiusM: 1000,
    competitorCategories: ['healthcare'],
    activityCategories: ['pharmacy', 'dentist', 'supermarket', 'bank'],
  },
  supermarket: {
    label: 'Supermarket', labelKa: 'სუპერმარკეტი', group: 'retail', defaultRadiusM: 1000,
    competitorCategories: ['supermarket'],
    activityCategories: ['pharmacy', 'bakery', 'bank', 'school', 'kindergarten'],
  },
  private_school: {
    label: 'Private school', labelKa: 'კერძო სკოლა', group: 'education', defaultRadiusM: 1000,
    competitorCategories: ['school'],
    activityCategories: ['kindergarten', 'supermarket', 'pharmacy'],
  },
  // Real estate: no competitors for homes (nearby flats prove demand as much as they compete), so that
  // factor carries no weight; offices compete with other offices.
  apartments: {
    label: 'Apartment building', labelKa: 'საცხოვრებელი კორპუსი', group: 'property', defaultRadiusM: 1000,
    competitorCategories: [],
    activityCategories: ['supermarket', 'convenience', 'pharmacy', 'bakery', 'school', 'kindergarten', 'healthcare', 'cafe'],
  },
  office_building: {
    label: 'Office building', labelKa: 'საოფისე შენობა', group: 'property', defaultRadiusM: 500,
    competitorCategories: ['office'],
    activityCategories: ['cafe', 'restaurant', 'fast_food', 'bank', 'supermarket'],
  },
};
