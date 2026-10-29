import { describe, it, expect } from 'vitest';

import { circlePolygon, distanceM, formatCoordinates, formatDistance } from './geo';

describe('circlePolygon', () => {
  const center = { lng: 44.79, lat: 41.71 };

  it('returns a closed ring', () => {
    const ring = circlePolygon(center, 500, 16);
    expect(ring).toHaveLength(17);
    expect(ring[0][0]).toBeCloseTo(ring[16][0], 10);
    expect(ring[0][1]).toBeCloseTo(ring[16][1], 10);
  });

  it('places the northern point roughly radius metres away', () => {
    const [, north] = circlePolygon(center, 1000, 4)[0];
    const metres = (north - center.lat) * 111_195;
    expect(metres).toBeGreaterThan(990);
    expect(metres).toBeLessThan(1010);
  });
});

describe('distanceM', () => {
  it('is zero for the same point and symmetric', () => {
    const a = { lng: 44.79, lat: 41.71 };
    const b = { lng: 44.8, lat: 41.72 };
    expect(distanceM(a, a)).toBe(0);
    expect(distanceM(a, b)).toBeCloseTo(distanceM(b, a), 6);
  });

  it('measures one hundredth of a degree of latitude as about 1.1 km', () => {
    expect(distanceM({ lng: 44.79, lat: 41.71 }, { lng: 44.79, lat: 41.72 })).toBeCloseTo(1112, 0);
  });
});

describe('formatDistance', () => {
  it('formats metres and kilometres', () => {
    expect(formatDistance(87.4)).toBe('87 m');
    expect(formatDistance(1530)).toBe('1.5 km');
  });
});

describe('formatCoordinates', () => {
  it('prints latitude first with hemispheres', () => {
    expect(formatCoordinates({ lng: 44.79983, lat: 41.71061 })).toBe('41.7106° N · 44.7998° E');
    expect(formatCoordinates({ lng: -0.5, lat: -12.25 })).toBe('12.2500° S · 0.5000° W');
  });
});
