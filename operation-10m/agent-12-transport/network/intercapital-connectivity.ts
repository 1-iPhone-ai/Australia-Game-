import type { AuRegionCode, TransportCorridorDefinition } from '../types.ts';
import type { CorridorActivation } from '../types.ts';
import { clamp } from '../productivity/formulas.ts';

/** 0–1 score from active multi-region corridors (intercapital / interstate chains). */
export function computeIntercapitalConnectivityIndex(
  activations: CorridorActivation[],
  definitions: TransportCorridorDefinition[],
): number {
  const defById = new Map(definitions.map((d) => [d.id, d]));
  let weighted = 0;
  let activeMulti = 0;

  for (const act of activations) {
    if (!act.active) continue;
    const def = defById.get(act.corridorId);
    if (!def || def.regionSequence.length < 2) continue;
    activeMulti += 1;
    weighted += act.synergyPoints + def.regionSequence.length * 0.35;
  }

  const density = activeMulti / Math.max(1, definitions.filter((d) => d.regionSequence.length >= 2).length);
  const raw = weighted * 0.012 + density * 0.45;
  return Math.round(clamp(raw, 0.12, 0.98) * 1000) / 1000;
}

export function connectivityBonusByRegion(
  activations: CorridorActivation[],
  definitions: TransportCorridorDefinition[],
): Record<AuRegionCode, number> {
  const defById = new Map(definitions.map((d) => [d.id, d]));
  const bonus = {} as Record<AuRegionCode, number>;
  for (const code of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as AuRegionCode[]) {
    bonus[code] = 0;
  }

  for (const act of activations) {
    if (!act.active) continue;
    const def = defById.get(act.corridorId);
    if (!def || def.regionSequence.length < 2) continue;
    const share = act.synergyPoints / def.regionSequence.length;
    for (const region of def.regionSequence) {
      bonus[region] += share * 0.08;
    }
  }
  return bonus;
}
