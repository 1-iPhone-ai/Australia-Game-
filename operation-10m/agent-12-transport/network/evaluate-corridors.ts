import { TRANSPORT_CORRIDORS } from '../catalog/corridors-catalog.ts';
import type {
  AuRegionCode,
  CorridorActivation,
  TransportAsset,
  TransportCorridorDefinition,
} from '../types.ts';

function assetMatchesTags(asset: TransportAsset, tags: string[]): boolean {
  return tags.some((t) => asset.tags.includes(t));
}

function regionSatisfied(
  region: AuRegionCode,
  requiredTags: string[] | undefined,
  operational: TransportAsset[],
): boolean {
  if (!requiredTags || requiredTags.length === 0) return operational.some((a) => a.hostRegion === region);
  return operational.some((a) => a.hostRegion === region && assetMatchesTags(a, requiredTags));
}

export function evaluateCorridorActivation(
  corridor: TransportCorridorDefinition,
  operationalAssets: TransportAsset[],
): CorridorActivation {
  const matchedRegions: AuRegionCode[] = [];
  const missingRegions: AuRegionCode[] = [];

  for (const region of corridor.regionSequence) {
    const tags = corridor.requiredTagsByRegion[region];
    if (regionSatisfied(region, tags, operationalAssets)) matchedRegions.push(region);
    else missingRegions.push(region);
  }

  const active = missingRegions.length === 0 && matchedRegions.length === corridor.regionSequence.length;

  return {
    corridorId: corridor.id,
    name: corridor.name,
    active,
    matchedRegions,
    missingRegions,
    synergyPoints: active ? corridor.productivitySynergyPoints : 0,
  };
}

export function evaluateAllCorridors(operationalAssets: TransportAsset[]): CorridorActivation[] {
  return TRANSPORT_CORRIDORS.map((c) => evaluateCorridorActivation(c, operationalAssets));
}

export function totalCorridorSynergy(activations: CorridorActivation[]): number {
  return activations.reduce((sum, a) => sum + a.synergyPoints, 0);
}

export function corridorLogisticsRelief(activations: CorridorActivation[]): number {
  let relief = 0;
  for (const activation of activations) {
    if (!activation.active) continue;
    const def = TRANSPORT_CORRIDORS.find((c) => c.id === activation.corridorId);
    if (def) relief += def.logisticsRelief;
  }
  return Math.min(0.25, relief);
}
