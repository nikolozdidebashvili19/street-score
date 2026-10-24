import { OSM_TAG_RULES, type OsmTagRule, type PlaceCategory } from '@/shared/const/places.const';

export type OsmTags = Record<string, string>;

function ruleMatches(rule: OsmTagRule, tags: OsmTags): boolean {
  return Object.entries(rule.match).every(([key, values]) => {
    const value = tags[key];
    if (value === undefined) return false;
    return values === '*' || values.includes(value);
  });
}

export function osmTagsToCategory(tags: OsmTags): PlaceCategory | null {
  const rule = OSM_TAG_RULES.find((candidate) => ruleMatches(candidate, tags));
  return rule?.category ?? null;
}
