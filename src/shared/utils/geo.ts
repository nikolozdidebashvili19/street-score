const EARTH_RADIUS_M = 6_371_008.8;
const DEFAULT_CIRCLE_STEPS = 64;

export type LngLat = { lng: number; lat: number };

/** Closed GeoJSON ring approximating a circle of `radiusM` metres around `center`. */
export function circlePolygon(center: LngLat, radiusM: number, steps = DEFAULT_CIRCLE_STEPS): [number, number][] {
  const latRad = (center.lat * Math.PI) / 180;
  const angular = radiusM / EARTH_RADIUS_M;
  const ring: [number, number][] = [];

  for (let step = 0; step <= steps; step += 1) {
    const bearing = (2 * Math.PI * step) / steps;
    const lat = Math.asin(
      Math.sin(latRad) * Math.cos(angular) + Math.cos(latRad) * Math.sin(angular) * Math.cos(bearing)
    );
    const lng =
      (center.lng * Math.PI) / 180 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angular) * Math.cos(latRad),
        Math.cos(angular) - Math.sin(latRad) * Math.sin(lat)
      );
    ring.push([(lng * 180) / Math.PI, (lat * 180) / Math.PI]);
  }

  return ring;
}

export function formatDistance(distanceM: number): string {
  if (distanceM < 1000) return `${Math.round(distanceM)} m`;
  return `${(distanceM / 1000).toFixed(1)} km`;
}
