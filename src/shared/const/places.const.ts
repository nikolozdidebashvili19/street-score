export const PLACE_CATEGORY_KEYS = [
  'cafe',
  'restaurant',
  'fast_food',
  'bar',
  'bakery',
  'hairdresser',
  'beauty',
  'gym',
  'clothes',
  'convenience',
  'supermarket',
  'bank',
  'pharmacy',
  'healthcare',
  'dentist',
  'florist',
  'pet',
  'bus_stop',
  'metro_station',
  'school',
  'kindergarten',
  'university',
  'office',
  'residential',
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORY_KEYS)[number];

export type PlaceGroup = 'business' | 'transport' | 'education' | 'workplace' | 'residential';

export type PlaceCategoryMeta = {
  label: string;
  labelKa: string;
  group: PlaceGroup;
};

export const PLACE_CATEGORIES: Record<PlaceCategory, PlaceCategoryMeta> = {
  cafe: { label: 'Café', labelKa: 'კაფე', group: 'business' },
  restaurant: { label: 'Restaurant', labelKa: 'რესტორანი', group: 'business' },
  fast_food: { label: 'Fast food', labelKa: 'სწრაფი კვება', group: 'business' },
  bar: { label: 'Bar / pub', labelKa: 'ბარი', group: 'business' },
  bakery: { label: 'Bakery', labelKa: 'საცხობი', group: 'business' },
  hairdresser: { label: 'Hairdresser', labelKa: 'პარიკმახერი', group: 'business' },
  beauty: { label: 'Beauty salon', labelKa: 'სილამაზის სალონი', group: 'business' },
  gym: { label: 'Gym / fitness', labelKa: 'სპორტული დარბაზი', group: 'business' },
  clothes: { label: 'Clothing & shoes', labelKa: 'ტანსაცმელი', group: 'business' },
  convenience: { label: 'Convenience store', labelKa: 'მარკეტი', group: 'business' },
  supermarket: { label: 'Supermarket', labelKa: 'სუპერმარკეტი', group: 'business' },
  bank: { label: 'Bank', labelKa: 'ბანკი', group: 'business' },
  pharmacy: { label: 'Pharmacy', labelKa: 'აფთიაქი', group: 'business' },
  healthcare: { label: 'Clinic / hospital', labelKa: 'კლინიკა', group: 'business' },
  dentist: { label: 'Dentist', labelKa: 'სტომატოლოგი', group: 'business' },
  florist: { label: 'Florist', labelKa: 'ყვავილების მაღაზია', group: 'business' },
  pet: { label: 'Pet shop / vet', labelKa: 'ზოომაღაზია / ვეტერინარი', group: 'business' },
  bus_stop: { label: 'Bus stop', labelKa: 'ავტობუსის გაჩერება', group: 'transport' },
  metro_station: { label: 'Metro entrance', labelKa: 'მეტრო', group: 'transport' },
  school: { label: 'School', labelKa: 'სკოლა', group: 'education' },
  kindergarten: { label: 'Kindergarten', labelKa: 'საბავშვო ბაღი', group: 'education' },
  university: { label: 'University / college', labelKa: 'უნივერსიტეტი', group: 'education' },
  office: { label: 'Office', labelKa: 'ოფისი', group: 'workplace' },
  residential: { label: 'Residential building', labelKa: 'საცხოვრებელი სახლი', group: 'residential' },
};

/** First matching rule wins. Every key in `match` must be present; `'*'` accepts any value. */
export type OsmTagRule = {
  match: Record<string, string[] | '*'>;
  category: PlaceCategory;
};

export const OSM_TAG_RULES: OsmTagRule[] = [
  { match: { amenity: ['cafe'] }, category: 'cafe' },
  { match: { amenity: ['restaurant'] }, category: 'restaurant' },
  { match: { amenity: ['fast_food'] }, category: 'fast_food' },
  { match: { amenity: ['bar', 'pub'] }, category: 'bar' },
  { match: { shop: ['hairdresser', 'barber'] }, category: 'hairdresser' },
  { match: { shop: ['beauty', 'cosmetics', 'massage'] }, category: 'beauty' },
  { match: { leisure: ['fitness_centre'] }, category: 'gym' },
  { match: { leisure: ['sports_centre'], sport: ['fitness', 'crossfit', 'yoga'] }, category: 'gym' },
  { match: { shop: ['clothes', 'shoes', 'fashion', 'boutique'] }, category: 'clothes' },
  { match: { shop: ['convenience', 'kiosk'] }, category: 'convenience' },
  { match: { shop: ['supermarket'] }, category: 'supermarket' },
  { match: { amenity: ['bank'] }, category: 'bank' },
  { match: { amenity: ['pharmacy'] }, category: 'pharmacy' },
  { match: { amenity: ['dentist'] }, category: 'dentist' },
  { match: { healthcare: ['dentist'] }, category: 'dentist' },
  { match: { amenity: ['clinic', 'hospital', 'doctors'] }, category: 'healthcare' },
  { match: { shop: ['bakery', 'pastry', 'confectionery'] }, category: 'bakery' },
  { match: { shop: ['florist'] }, category: 'florist' },
  { match: { shop: ['pet'] }, category: 'pet' },
  { match: { amenity: ['veterinary'] }, category: 'pet' },
  { match: { highway: ['bus_stop'] }, category: 'bus_stop' },
  { match: { railway: ['subway_entrance'] }, category: 'metro_station' },
  { match: { station: ['subway'] }, category: 'metro_station' },
  { match: { amenity: ['school'] }, category: 'school' },
  { match: { amenity: ['kindergarten'] }, category: 'kindergarten' },
  { match: { amenity: ['university', 'college'] }, category: 'university' },
  { match: { office: '*' }, category: 'office' },
  { match: { building: ['apartments', 'residential', 'house'] }, category: 'residential' },
];

export const RADIUS_OPTIONS_M = [250, 500, 1000] as const;

export const MIN_RADIUS_M = 50;
export const MAX_RADIUS_M = 2000;

/** [west, south, east, north] — WGS84. */
export type BoundingBox = [number, number, number, number];

export type ImportArea = {
  label: string;
  bbox: BoundingBox;
};

export const IMPORT_AREAS: Record<string, ImportArea> = {
  vake: { label: 'Vake', bbox: [44.735, 41.700, 44.775, 41.722] },
  saburtalo: { label: 'Saburtalo', bbox: [44.725, 41.715, 44.775, 41.745] },
  vera: { label: 'Vera', bbox: [44.770, 41.700, 44.790, 41.715] },
  'old-tbilisi': { label: 'Old Tbilisi', bbox: [44.795, 41.685, 44.820, 41.700] },
  tbilisi: { label: 'Tbilisi (all)', bbox: [44.650, 41.620, 44.990, 41.820] },
};
