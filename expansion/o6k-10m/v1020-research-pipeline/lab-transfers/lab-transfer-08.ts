import { V1020_RPIPE_clamp } from '../engine/research-pipeline-utils.ts';
import type { V1020RpipeComplianceBand, V1020RpipeRegionId, V1020RpipeSystemDomain } from '../types/core.ts';

export const V1020_RPIPE_LAB_TRANSFER_NODE_08_META = {
  id: 'lab_transfer_08',
  regionId: 'NSW' as V1020RpipeRegionId,
  anchorSystem: 'telecom' as V1020RpipeSystemDomain,
  defaultBand: 'critical' as V1020RpipeComplianceBand,
} as const;

const V1020_RPIPE_LAB_TRANSFER_NODE_08_STEPS = [
  { step: 0, bufferDays: 0.29, rerouteCost: 8 },
  { step: 1, bufferDays: 0.3, rerouteCost: 9 },
  { step: 2, bufferDays: 0.31, rerouteCost: 10 },
  { step: 3, bufferDays: 0.32, rerouteCost: 0 },
  { step: 4, bufferDays: 0.33, rerouteCost: 1 },
  { step: 5, bufferDays: 0.34, rerouteCost: 2 },
  { step: 6, bufferDays: 0.35, rerouteCost: 3 },
  { step: 7, bufferDays: 0.36, rerouteCost: 4 },
  { step: 8, bufferDays: 0.37, rerouteCost: 5 },
  { step: 9, bufferDays: 0.38, rerouteCost: 6 },
  { step: 10, bufferDays: 0.39, rerouteCost: 7 },
  { step: 11, bufferDays: 0.4, rerouteCost: 8 },
  { step: 12, bufferDays: 0.41, rerouteCost: 9 },
  { step: 13, bufferDays: 0.42, rerouteCost: 10 },
  { step: 14, bufferDays: 0.43, rerouteCost: 0 },
  { step: 15, bufferDays: 0.44, rerouteCost: 1 },
  { step: 16, bufferDays: 0.45, rerouteCost: 2 },
  { step: 17, bufferDays: 0.46, rerouteCost: 3 },
  { step: 18, bufferDays: 0.47, rerouteCost: 4 },
  { step: 19, bufferDays: 0.48, rerouteCost: 5 },
  { step: 20, bufferDays: 0.49, rerouteCost: 6 },
  { step: 21, bufferDays: 0.5, rerouteCost: 7 },
  { step: 22, bufferDays: 0.51, rerouteCost: 8 },
  { step: 23, bufferDays: 0.52, rerouteCost: 9 },
  { step: 24, bufferDays: 0.53, rerouteCost: 10 },
  { step: 25, bufferDays: 0.54, rerouteCost: 0 },
  { step: 26, bufferDays: 0.55, rerouteCost: 1 },
  { step: 27, bufferDays: 0.56, rerouteCost: 2 },
  { step: 28, bufferDays: 0.57, rerouteCost: 3 },
  { step: 29, bufferDays: 0.58, rerouteCost: 4 },
  { step: 30, bufferDays: 0.59, rerouteCost: 5 },
  { step: 31, bufferDays: 0.6, rerouteCost: 6 },
  { step: 32, bufferDays: 0.61, rerouteCost: 7 },
  { step: 33, bufferDays: 0.62, rerouteCost: 8 },
] as const;

export function V1020_RPIPE_LAB_TRANSFER_NODE_08_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1020_RPIPE_LAB_TRANSFER_NODE_08_STEPS.length; i++) {
    const row = V1020_RPIPE_LAB_TRANSFER_NODE_08_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }
  return V1020_RPIPE_clamp(acc / V1020_RPIPE_LAB_TRANSFER_NODE_08_STEPS.length, 0, 1);
}

export function V1020_RPIPE_LAB_TRANSFER_NODE_08_rerouteStress(turn: number): number {
  return V1020_RPIPE_clamp(
    V1020_RPIPE_LAB_TRANSFER_NODE_08_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}
