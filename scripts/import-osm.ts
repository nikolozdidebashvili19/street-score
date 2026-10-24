/**
 * Bulk-imports OpenStreetMap places for one area into MongoDB.
 * Usage: npm run import:osm -- vake   (areas: see IMPORT_AREAS in src/shared/const/places.const.ts)
 */
import { importPlacesService } from '@/features/places/service/place-import.service';
import { IMPORT_AREAS } from '@/shared/const/places.const';
import { mongo } from '@/shared/lib/mongo';

async function main() {
  const areaKey = process.argv[2] ?? 'vake';
  process.stdout.write(`Importing OSM places for "${areaKey}"…\n`);

  const result = await importPlacesService(areaKey);
  if (result.status !== 200) {
    console.error(`Import failed: ${JSON.stringify(result.data)}. Known areas: ${Object.keys(IMPORT_AREAS).join(', ')}`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`${JSON.stringify(result.data, null, 2)}\n`);
  }

  await mongo.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongo.disconnect();
  process.exitCode = 1;
});
