import { describe, it, expect } from 'vitest';

import { osmTagsToCategory } from './osm';

describe('osmTagsToCategory', () => {
  it('maps a simple amenity tag', () => {
    expect(osmTagsToCategory({ amenity: 'cafe', name: 'Coffee Lab' })).toBe('cafe');
  });

  it('maps one of several accepted values', () => {
    expect(osmTagsToCategory({ shop: 'barber' })).toBe('hairdresser');
    expect(osmTagsToCategory({ amenity: 'pub' })).toBe('bar');
  });

  it('accepts any value for wildcard rules', () => {
    expect(osmTagsToCategory({ office: 'it' })).toBe('office');
    expect(osmTagsToCategory({ office: 'company' })).toBe('office');
  });

  it('requires every key of a multi-key rule', () => {
    expect(osmTagsToCategory({ leisure: 'sports_centre', sport: 'fitness' })).toBe('gym');
    expect(osmTagsToCategory({ leisure: 'sports_centre', sport: 'football' })).toBeNull();
  });

  it('uses the first matching rule', () => {
    expect(osmTagsToCategory({ amenity: 'cafe', building: 'apartments' })).toBe('cafe');
  });

  it('maps metro entrances and stations', () => {
    expect(osmTagsToCategory({ railway: 'subway_entrance' })).toBe('metro_station');
    expect(osmTagsToCategory({ railway: 'station', station: 'subway' })).toBe('metro_station');
  });

  it('maps the newer business categories', () => {
    expect(osmTagsToCategory({ shop: 'pastry' })).toBe('bakery');
    expect(osmTagsToCategory({ amenity: 'dentist' })).toBe('dentist');
    expect(osmTagsToCategory({ healthcare: 'dentist' })).toBe('dentist');
    expect(osmTagsToCategory({ amenity: 'clinic' })).toBe('healthcare');
    expect(osmTagsToCategory({ shop: 'florist' })).toBe('florist');
    expect(osmTagsToCategory({ amenity: 'veterinary' })).toBe('pet');
  });

  it('returns null for unknown tags', () => {
    expect(osmTagsToCategory({ amenity: 'bench' })).toBeNull();
    expect(osmTagsToCategory({})).toBeNull();
  });
});
