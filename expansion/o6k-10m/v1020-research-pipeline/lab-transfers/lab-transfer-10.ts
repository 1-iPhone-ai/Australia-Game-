import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils.ts';
import type { V1020RpipeComplianceBand, V1020RpipeRegionId, V1020RpipeSystemDomain } from '../types/core.ts';

export const V1020_RPIPE_LAB_TRANSFER_NODE_10_META = {
  id: 'lab_transfer_10',
  regionId: 'QLD' as V1020RpipeRegionId,
  anchorSystem: 'freight' as V1020RpipeSystemDomain,
  defaultBand: 'latent' as V1020RpipeComplianceBand,
} as const;

const V1020_RPIPE_LAB_TRANSFER_NODE_10_STEPS = [
  { step: 0, bufferDays: 0.63, rerouteCost: 10 },
  { step: 1, bufferDays: 0.64, rerouteCost: 0 },
  { step: 2, bufferDays: 0.65, rerouteCost: 1 },
  { step: 3, bufferDays: 0.66, rerouteCost: 2 },
  { step: 4, bufferDays: 0.67, rerouteCost: 3 },
  { step: 5, bufferDays: 0.68, rerouteCost: 4 },
  { step: 6, bufferDays: 0.69, rerouteCost: 5 },
  { step: 7, bufferDays: 0.7, rerouteCost: 6 },
  { step: 8, bufferDays: 0.71, rerouteCost: 7 },
  { step: 9, bufferDays: 0.72, rerouteCost: 8 },
  { step: 10, bufferDays: 0.28, rerouteCost: 9 },
  { step: 11, bufferDays: 0.29, rerouteCost: 10 },
  { step: 12, bufferDays: 0.3, rerouteCost: 0 },
  { step: 13, bufferDays: 0.31, rerouteCost: 1 },
  { step: 14, bufferDays: 0.32, rerouteCost: 2 },
  { step: 15, bufferDays: 0.33, rerouteCost: 3 },
  { step: 16, bufferDays: 0.34, rerouteCost: 4 },
  { step: 17, bufferDays: 0.35, rerouteCost: 5 },
  { step: 18, bufferDays: 0.36, rerouteCost: 6 },
  { step: 19, bufferDays: 0.37, rerouteCost: 7 },
  { step: 20, bufferDays: 0.38, rerouteCost: 8 },
  { step: 21, bufferDays: 0.39, rerouteCost: 9 },
  { step: 22, bufferDays: 0.4, rerouteCost: 10 },
  { step: 23, bufferDays: 0.41, rerouteCost: 0 },
  { step: 24, bufferDays: 0.42, rerouteCost: 1 },
  { step: 25, bufferDays: 0.43, rerouteCost: 2 },
  { step: 26, bufferDays: 0.44, rerouteCost: 3 },
  { step: 27, bufferDays: 0.45, rerouteCost: 4 },
  { step: 28, bufferDays: 0.46, rerouteCost: 5 },
  { step: 29, bufferDays: 0.47, rerouteCost: 6 },
  { step: 30, bufferDays: 0.48, rerouteCost: 7 },
  { step: 31, bufferDays: 0.49, rerouteCost: 8 },
  { step: 32, bufferDays: 0.5, rerouteCost: 9 },
  { step: 33, bufferDays: 0.51, rerouteCost: 10 },
] as const;

export function V1020_RPIPE_LAB_TRANSFER_NODE_10_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1020_RPIPE_LAB_TRANSFER_NODE_10_STEPS.length; i++) {
    const row = V1020_RPIPE_LAB_TRANSFER_NODE_10_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }
  return V1020_RPIPE_clamp(acc / V1020_RPIPE_LAB_TRANSFER_NODE_10_STEPS.length, 0, 1);
}

export function V1020_RPIPE_LAB_TRANSFER_NODE_10_rerouteStress(turn: number): number {
  return V1020_RPIPE_clamp(
    V1020_RPIPE_LAB_TRANSFER_NODE_10_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}
