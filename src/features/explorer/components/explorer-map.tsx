'use client';
import * as maplibregl from 'maplibre-gl';
import { type GeoJSONSource } from 'maplibre-gl';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';

import { MapLegend } from '@/features/explorer/components/map-legend';
import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import {
  MAP_ATTRIBUTION,
  MAP_COLORS,
  MAP_DEFAULT_ZOOM,
  MAP_FOCUS_ZOOM,
  MAP_LABEL_FONT,
  MAP_STYLE_URLS,
  MAPLIBRE_WORKER_URL,
  TBILISI_CENTER,
} from '@/shared/const/map.const';
import { PLACE_CATEGORIES } from '@/shared/const/places.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { circlePolygon } from '@/shared/utils/geo';
import { getPlaceRole } from '@/shared/utils/places';

maplibregl.setWorkerUrl(MAPLIBRE_WORKER_URL);

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

/** Custom sources/layers are wiped by setStyle, so this runs on every style load. */
function addLayers(map: maplibregl.Map) {
  if (map.getSource('places')) return;
  map.addSource('radius', { type: 'geojson', data: EMPTY_COLLECTION });
  map.addSource('places', { type: 'geojson', data: EMPTY_COLLECTION });
  map.addLayer({ id: 'radius-fill', type: 'fill', source: 'radius', paint: { 'fill-color': MAP_COLORS.radius, 'fill-opacity': 0.08 } });
  map.addLayer({
    id: 'radius-line',
    type: 'line',
    source: 'radius',
    paint: { 'line-color': MAP_COLORS.radius, 'line-width': 2, 'line-dasharray': [2, 2] },
  });
  map.addLayer({
    id: 'places',
    type: 'circle',
    source: 'places',
    // Competitors draw on top of everything else.
    layout: { 'circle-sort-key': ['match', ['get', 'role'], 'competitor', 3, 'activity', 2, 'transport', 1, 0] },
    paint: {
      // Grow with zoom so dots stay readable both city-wide and street-level.
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        12, ['match', ['get', 'role'], 'competitor', 5, 'context', 2.5, 4],
        15, ['match', ['get', 'role'], 'competitor', 9, 'context', 4.5, 7],
        18, ['match', ['get', 'role'], 'competitor', 13, 'context', 6, 10],
      ],
      'circle-color': [
        'match',
        ['get', 'role'],
        'competitor', MAP_COLORS.competitor,
        'activity', MAP_COLORS.activity,
        'transport', MAP_COLORS.transport,
        MAP_COLORS.context,
      ],
      'circle-opacity': ['match', ['get', 'role'], 'context', 0.75, 1],
      'circle-stroke-color': MAP_COLORS.stroke,
      'circle-stroke-width': ['match', ['get', 'role'], 'competitor', 2.5, 'context', 1, 2],
    },
  });
  map.addLayer({
    id: 'competitor-labels',
    type: 'symbol',
    source: 'places',
    minzoom: 14.5,
    filter: ['==', ['get', 'role'], 'competitor'],
    layout: {
      'text-field': ['get', 'name'],
      'text-font': [MAP_LABEL_FONT],
      'text-size': 12,
      'text-anchor': 'top',
      'text-offset': [0, 1],
      'text-max-width': 10,
      'text-optional': true,
    },
    paint: {
      'text-color': MAP_COLORS.competitorLabel,
      'text-halo-color': MAP_COLORS.stroke,
      'text-halo-width': 1.5,
    },
  });
}

export const ExplorerMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [styleVersion, setStyleVersion] = useState(0);
  const { pin, radiusM, places, businessType, setPin } = useExplorerStore();
  const { t, label } = useI18n();
  const { resolvedTheme } = useTheme();
  const styleUrl = resolvedTheme === 'light' ? MAP_STYLE_URLS.light : MAP_STYLE_URLS.dark;
  const droppedPinLabelRef = useRef(t.explorer.droppedPin);
  const initialStyleRef = useRef(styleUrl);
  const appliedStyleRef = useRef(styleUrl);
  const flownPinRef = useRef<typeof pin>(null);

  useEffect(() => {
    droppedPinLabelRef.current = t.explorer.droppedPin;
  }, [t]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: initialStyleRef.current,
      center: TBILISI_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
      attributionControl: false,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: MAP_ATTRIBUTION }));
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('style.load', () => {
      addLayers(map);
      setStyleVersion((version) => version + 1);
    });
    map.on('click', (event) => {
      setPin({ lng: event.lngLat.lng, lat: event.lngLat.lat, label: droppedPinLabelRef.current, fromSearch: false });
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setPin]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0 || appliedStyleRef.current === styleUrl) return;
    appliedStyleRef.current = styleUrl;
    map.setStyle(styleUrl);
  }, [styleUrl, styleVersion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0) return;

    const radiusSource = map.getSource<GeoJSONSource>('radius');
    if (!pin) {
      markerRef.current?.remove();
      markerRef.current = null;
      radiusSource?.setData(EMPTY_COLLECTION);
      return;
    }

    markerRef.current ??= new maplibregl.Marker({ color: MAP_COLORS.pin });
    markerRef.current.setLngLat([pin.lng, pin.lat]).addTo(map);
    radiusSource?.setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [circlePolygon(pin, radiusM)] },
    });
  }, [pin, radiusM, styleVersion]);

  /** Fly once per searched or deep-linked pin — including one that arrived before the style loaded. */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0 || !pin?.fromSearch || flownPinRef.current === pin) return;
    flownPinRef.current = pin;
    map.flyTo({ center: [pin.lng, pin.lat], zoom: MAP_FOCUS_ZOOM });
  }, [pin, styleVersion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0) return;
    map.getSource<GeoJSONSource>('places')?.setData({
      type: 'FeatureCollection',
      features: places.map((place) => ({
        type: 'Feature',
        properties: {
          name: place.name || label(PLACE_CATEGORIES[place.category]),
          role: getPlaceRole(place.category, businessType),
        },
        geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
      })),
    });
  }, [places, businessType, styleVersion, label]);

  return (
    <div className="relative size-full">
      <div ref={containerRef} className="size-full" aria-label={t.explorer.mapRegion} role="region" />
      <MapLegend />
    </div>
  );
};
