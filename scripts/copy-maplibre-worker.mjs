/**
 * MapLibre 6 resolves its web worker relative to its own module URL, which breaks once the library
 * is bundled. Copy the worker into public/ so it is served at MAPLIBRE_WORKER_URL (see map.const.ts).
 * Runs automatically before `dev` and `build`.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const source = join(dirname(require.resolve('maplibre-gl/package.json')), 'dist', 'maplibre-gl-worker.mjs');
const target = join(process.cwd(), 'public', 'vendor', 'maplibre-gl-worker.mjs');

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
