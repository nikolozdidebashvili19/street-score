'use client';
import * as maplibregl from 'maplibre-gl';
import { type GeoJSONSource } from 'maplibre-gl';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { type ExpansionPlan } from '@/features/expansion/types/expansion.types';
import {
  EXPANSION_MAP_COLORS,
  EXPANSION_MAP_LEGEND,
  MAP_ATTRIBUTION,
  MAP_DEFAULT_ZOOM,
  MAP_FOCUS_ZOOM,
  MAP_LABEL_FONT,
  MAP_STYLE_URLS,
  MAPLIBRE_WORKER_URL,
  TBILISI_CENTER,
} from '@/shared/const/map.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';
import { circlePolygon, type LngLat } from '@/shared/utils/geo';

maplibregl.setWorkerUrl(MAPLIBRE_WORKER_URL);

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
const FIT_PADDING = 64;
const BRANCHES_FITTED = 'branches';
const ROLE_COLOR: maplibregl.ExpressionSpecification = [
  'match',
  ['get', 'role'],
  'site', EXPANSION_MAP_COLORS.site,
  'draft', EXPANSION_MAP_COLORS.draft,
  EXPANSION_MAP_COLORS.branch,
];

/** Custom sources/layers are wiped by setStyle, so this runs on every style load. */
function addLayers(map: maplibregl.Map) {
  if (map.getSource('points')) return;
  map.addSource('catchments', { type: 'geojson', data: EMPTY_COLLECTION });
  map.addSource('points', { type: 'geojson', data: EMPTY_COLLECTION });
  map.addLayer({ id: 'catchment-fill', type: 'fill', source: 'catchments', paint: { 'fill-color': ROLE_COLOR, 'fill-opacity': 0.07 } });
  map.addLayer({
    id: 'catchment-line',
    type: 'line',
    source: 'catchments',
    paint: { 'line-color': ROLE_COLOR, 'line-width': 1.5, 'line-dasharray': [2, 2] },
  });
  map.addLayer({
    id: 'points',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-radius': ['match', ['get', 'role'], 'draft', 8, 11],
      'circle-color': ROLE_COLOR,
      'circle-stroke-color': EXPANSION_MAP_COLORS.label,
      'circle-stroke-width': 2,
    },
  });
  map.addLayer({
    // Shops and spots carry the same numbers as the lists beside the map.
    id: 'point-numbers',
    type: 'symbol',
    source: 'points',
    filter: ['!=', ['get', 'role'], 'draft'],
    layout: { 'text-field': ['get', 'rank'], 'text-font': [MAP_LABEL_FONT], 'text-size': 12, 'text-allow-overlap': true },
    paint: { 'text-color': EXPANSION_MAP_COLORS.label },
  });
  map.addLayer({
    id: 'branch-labels',
    type: 'symbol',
    source: 'points',
    minzoom: 12.5,
    filter: ['==', ['get', 'role'], 'branch'],
    layout: {
      'text-field': ['get', 'name'],
      'text-font': [MAP_LABEL_FONT],
      'text-size': 12,
      'text-anchor': 'top',
      'text-offset': [0, 1.1],
      'text-optional': true,
    },
    paint: { 'text-color': EXPANSION_MAP_COLORS.branch, 'text-halo-color': EXPANSION_MAP_COLORS.label, 'text-halo-width': 1.5 },
  });
}

type MapPoint = LngLat & { role: 'branch' | 'site' | 'draft'; name: string; rank: string };

function catchment({ lng, lat, role }: MapPoint, radiusM: number): GeoJSON.Feature {
  return {
    type: 'Feature',
    properties: { role },
    geometry: { type: 'Polygon', coordinates: [circlePolygon({ lng, lat }, radiusM)] },
  };
}

export const ExpansionMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [styleVersion, setStyleVersion] = useState(0);
  const { branches, draft, focus, plan, radiusM, setDraft } = useExpansionStore();
  const { t, format } = useI18n();
  const { resolvedTheme } = useTheme();
  const styleUrl = resolvedTheme === 'light' ? MAP_STYLE_URLS.light : MAP_STYLE_URLS.dark;
  const initialStyleRef = useRef(styleUrl);
  const appliedStyleRef = useRef(styleUrl);
  const fittedRef = useRef<ExpansionPlan | typeof BRANCHES_FITTED | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyleRef.current,
      center: TBILISI_CENTER,
      zoom: MAP_DEFAULT_ZOOM - 1,
      attributionControl: false,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: MAP_ATTRIBUTION }));
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('style.load', () => {
      addLayers(map);
      setStyleVersion((version) => version + 1);
    });
    map.on('click', (event) => {
      setDraft({ lng: event.lngLat.lng, lat: event.lngLat.lat, address: '', fromSearch: false });
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setDraft]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0 || appliedStyleRef.current === styleUrl) return;
    appliedStyleRef.current = styleUrl;
    map.setStyle(styleUrl);
  }, [styleUrl, styleVersion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0) return;

    const points: MapPoint[] = [
      ...branches.map((branch, index) => ({
        lng: branch.lng,
        lat: branch.lat,
        role: 'branch' as const,
        name: branch.label,
        rank: String(index + 1),
      })),
      ...(plan?.sites ?? []).map((site) => ({
        lng: site.lng,
        lat: site.lat,
        role: 'site' as const,
        name: format(t.expansion.spotName, { rank: site.rank }),
        rank: String(site.rank),
      })),
      ...(draft ? [{ lng: draft.lng, lat: draft.lat, role: 'draft' as const, name: '', rank: '' }] : []),
    ];

    map.getSource<GeoJSONSource>('catchments')?.setData({
      type: 'FeatureCollection',
      features: points.filter((point) => point.role !== 'draft').map((point) => catchment(point, plan?.radiusM ?? radiusM)),
    });
    map.getSource<GeoJSONSource>('points')?.setData({
      type: 'FeatureCollection',
      features: points.map(({ lng, lat, role, name, rank }) => ({
        type: 'Feature',
        properties: { role, name, rank },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      })),
    });
  }, [branches, draft, plan, radiusM, styleVersion, format, t]);

  /** Frame the network once when branches first load, then once per new plan — not on every edit. */
  useEffect(() => {
    const map = mapRef.current;
    const target = plan ?? (branches.length > 0 ? BRANCHES_FITTED : null);
    if (!map || styleVersion === 0 || !target || fittedRef.current === target) return;
    if (target === BRANCHES_FITTED && fittedRef.current !== null) return;
    fittedRef.current = target;

    const coords = [...branches, ...(plan?.sites ?? [])].map(({ lng, lat }) => [lng, lat] as [number, number]);
    if (coords.length === 0) return;
    const bounds = coords.reduce((acc, coord) => acc.extend(coord), new maplibregl.LngLatBounds(coords[0], coords[0]));
    map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: MAP_FOCUS_ZOOM, duration: 600 });
  }, [plan, branches, styleVersion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0 || !draft?.fromSearch) return;
    map.flyTo({ center: [draft.lng, draft.lat], zoom: MAP_FOCUS_ZOOM });
  }, [draft, styleVersion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0 || !focus) return;
    map.flyTo({ center: [focus.lng, focus.lat], zoom: MAP_FOCUS_ZOOM });
  }, [focus, styleVersion]);

  return (
    <div className="relative size-full">
      <div ref={containerRef} className="size-full" aria-label={t.expansion.mapRegion} role="region" />
      <ul className="absolute left-3 top-3 flex flex-col gap-1.5 rounded-md border border-border bg-card px-3 py-2.5 text-xs">
        {EXPANSION_MAP_LEGEND.filter(({ role }) => role !== 'draft' || draft).map(({ role, dotClassName }) => (
          <li key={role} className="flex items-center gap-2">
            <span className={cn('size-2.5 rounded-full', dotClassName)} aria-hidden="true" />
            <span className="text-muted-foreground">{t.expansion.legend[role]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
