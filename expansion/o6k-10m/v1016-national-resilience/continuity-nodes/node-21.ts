import { V1016_NRES_clamp } from '../engine/national-resilience-utils.ts';
import type { V1016NresContinuityBand, V1016NresRegionId, V1016NresSystemDomain } from '../types/core.ts';

export const V1016_NRES_CONTINUITY_NODE_21_META = {
  id: 'node_21',
  regionId: 'TAS' as V1016NresRegionId,
  anchorSystem: 'energy' as V1016NresSystemDomain,
  defaultBand: 'emerging' as V1016NresContinuityBand,
} as const;

const V1016_NRES_CONTINUITY_NODE_21_STEPS = [
  { step: 0, bufferDays: 0.7, rerouteCost: 10 },
  { step: 1, bufferDays: 0.71, rerouteCost: 0 },
  { step: 2, bufferDays: 0.72, rerouteCost: 1 },
  { step: 3, bufferDays: 0.28, rerouteCost: 2 },
  { step: 4, bufferDays: 0.29, rerouteCost: 3 },
  { step: 5, bufferDays: 0.3, rerouteCost: 4 },
  { step: 6, bufferDays: 0.31, rerouteCost: 5 },
  { step: 7, bufferDays: 0.32, rerouteCost: 6 },
  { step: 8, bufferDays: 0.33, rerouteCost: 7 },
  { step: 9, bufferDays: 0.34, rerouteCost: 8 },
  { step: 10, bufferDays: 0.35, rerouteCost: 9 },
  { step: 11, bufferDays: 0.36, rerouteCost: 10 },
  { step: 12, bufferDays: 0.37, rerouteCost: 0 },
  { step: 13, bufferDays: 0.38, rerouteCost: 1 },
  { step: 14, bufferDays: 0.39, rerouteCost: 2 },
  { step: 15, bufferDays: 0.4, rerouteCost: 3 },
  { step: 16, bufferDays: 0.41, rerouteCost: 4 },
  { step: 17, bufferDays: 0.42, rerouteCost: 5 },
  { step: 18, bufferDays: 0.43, rerouteCost: 6 },
  { step: 19, bufferDays: 0.44, rerouteCost: 7 },
  { step: 20, bufferDays: 0.45, rerouteCost: 8 },
  { step: 21, bufferDays: 0.46, rerouteCost: 9 },
  { step: 22, bufferDays: 0.47, rerouteCost: 10 },
  { step: 23, bufferDays: 0.48, rerouteCost: 0 },
  { step: 24, bufferDays: 0.49, rerouteCost: 1 },
  { step: 25, bufferDays: 0.5, rerouteCost: 2 },
  { step: 26, bufferDays: 0.51, rerouteCost: 3 },
  { step: 27, bufferDays: 0.52, rerouteCost: 4 },
  { step: 28, bufferDays: 0.53, rerouteCost: 5 },
  { step: 29, bufferDays: 0.54, rerouteCost: 6 },
  { step: 30, bufferDays: 0.55, rerouteCost: 7 },
  { step: 31, bufferDays: 0.56, rerouteCost: 8 },
  { step: 32, bufferDays: 0.57, rerouteCost: 9 },
  { step: 33, bufferDays: 0.58, rerouteCost: 10 },
] as const;

export function V1016_NRES_CONTINUITY_NODE_21_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1016_NRES_CONTINUITY_NODE_21_STEPS.length; i++) {
    const row = V1016_NRES_CONTINUITY_NODE_21_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }
  return V1016_NRES_clamp(acc / V1016_NRES_CONTINUITY_NODE_21_STEPS.length, 0, 1);
}

export function V1016_NRES_CONTINUITY_NODE_21_rerouteStress(turn: number): number {
  return V1016_NRES_clamp(
    V1016_NRES_CONTINUITY_NODE_21_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}
