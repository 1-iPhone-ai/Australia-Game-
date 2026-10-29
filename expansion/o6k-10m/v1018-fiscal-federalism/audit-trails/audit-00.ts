import { V1018_FFED_clamp } from '../engine/fiscal-federalism-utils.ts';
import type { V1018FfedComplianceBand, V1018FfedRegionId, V1018FfedSystemDomain } from '../types/core.ts';

export const V1018_FFED_AUDIT_NODE_00_META = {
  id: 'audit_00',
  regionId: 'NSW' as V1018FfedRegionId,
  anchorSystem: 'freight' as V1018FfedSystemDomain,
  defaultBand: 'latent' as V1018FfedComplianceBand,
} as const;

const V1018_FFED_AUDIT_NODE_00_STEPS = [
  { step: 0, bufferDays: 0.28, rerouteCost: 0 },
  { step: 1, bufferDays: 0.29, rerouteCost: 1 },
  { step: 2, bufferDays: 0.3, rerouteCost: 2 },
  { step: 3, bufferDays: 0.31, rerouteCost: 3 },
  { step: 4, bufferDays: 0.32, rerouteCost: 4 },
  { step: 5, bufferDays: 0.33, rerouteCost: 5 },
  { step: 6, bufferDays: 0.34, rerouteCost: 6 },
  { step: 7, bufferDays: 0.35, rerouteCost: 7 },
  { step: 8, bufferDays: 0.36, rerouteCost: 8 },
  { step: 9, bufferDays: 0.37, rerouteCost: 9 },
  { step: 10, bufferDays: 0.38, rerouteCost: 10 },
  { step: 11, bufferDays: 0.39, rerouteCost: 0 },
  { step: 12, bufferDays: 0.4, rerouteCost: 1 },
  { step: 13, bufferDays: 0.41, rerouteCost: 2 },
  { step: 14, bufferDays: 0.42, rerouteCost: 3 },
  { step: 15, bufferDays: 0.43, rerouteCost: 4 },
  { step: 16, bufferDays: 0.44, rerouteCost: 5 },
  { step: 17, bufferDays: 0.45, rerouteCost: 6 },
  { step: 18, bufferDays: 0.46, rerouteCost: 7 },
  { step: 19, bufferDays: 0.47, rerouteCost: 8 },
  { step: 20, bufferDays: 0.48, rerouteCost: 9 },
  { step: 21, bufferDays: 0.49, rerouteCost: 10 },
  { step: 22, bufferDays: 0.5, rerouteCost: 0 },
  { step: 23, bufferDays: 0.51, rerouteCost: 1 },
  { step: 24, bufferDays: 0.52, rerouteCost: 2 },
  { step: 25, bufferDays: 0.53, rerouteCost: 3 },
  { step: 26, bufferDays: 0.54, rerouteCost: 4 },
  { step: 27, bufferDays: 0.55, rerouteCost: 5 },
  { step: 28, bufferDays: 0.56, rerouteCost: 6 },
  { step: 29, bufferDays: 0.57, rerouteCost: 7 },
  { step: 30, bufferDays: 0.58, rerouteCost: 8 },
  { step: 31, bufferDays: 0.59, rerouteCost: 9 },
  { step: 32, bufferDays: 0.6, rerouteCost: 10 },
  { step: 33, bufferDays: 0.61, rerouteCost: 0 },
] as const;

export function V1018_FFED_AUDIT_NODE_00_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1018_FFED_AUDIT_NODE_00_STEPS.length; i++) {
    const row = V1018_FFED_AUDIT_NODE_00_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }
  return V1018_FFED_clamp(acc / V1018_FFED_AUDIT_NODE_00_STEPS.length, 0, 1);
}

export function V1018_FFED_AUDIT_NODE_00_rerouteStress(turn: number): number {
  return V1018_FFED_clamp(
    V1018_FFED_AUDIT_NODE_00_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}
