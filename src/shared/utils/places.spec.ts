import { describe, it, expect } from 'vitest';

import { getPlaceRole } from './places';

describe('getPlaceRole', () => {
  it('marks direct competitors for the chosen business type', () => {
    expect(getPlaceRole('cafe', 'cafe')).toBe('competitor');
    expect(getPlaceRole('beauty', 'salon')).toBe('competitor');
  });

  it('marks complementary businesses as activity', () => {
    expect(getPlaceRole('bank', 'cafe')).toBe('activity');
  });

  it('marks transport and everything else as context', () => {
    expect(getPlaceRole('bus_stop', 'gym')).toBe('transport');
    expect(getPlaceRole('residential', 'cafe')).toBe('context');
  });

  it('depends on the business type', () => {
    expect(getPlaceRole('cafe', 'retail')).toBe('activity');
  });
});
