import { V1019_MTRD_clamp } from '../engine/maritime-trade-utils.ts';
import type { V1019MtrdPortBand, V1019MtrdRegionId, V1019MtrdSystemDomain } from '../types/core.ts';

export const V1019_MTRD_PORT_NODE_01_META = {
  id: 'port_01',
  regionId: 'VIC' as V1019MtrdRegionId,
  anchorSystem: 'energy' as V1019MtrdSystemDomain,
  defaultBand: 'emerging' as V1019MtrdPortBand,
} as const;

const V1019_MTRD_PORT_NODE_01_STEPS = [
  { step: 0, bufferDays: 0.45, rerouteCost: 1 },
  { step: 1, bufferDays: 0.46, rerouteCost: 2 },
  { step: 2, bufferDays: 0.47, rerouteCost: 3 },
  { step: 3, bufferDays: 0.48, rerouteCost: 4 },
  { step: 4, bufferDays: 0.49, rerouteCost: 5 },
  { step: 5, bufferDays: 0.5, rerouteCost: 6 },
  { step: 6, bufferDays: 0.51, rerouteCost: 7 },
  { step: 7, bufferDays: 0.52, rerouteCost: 8 },
  { step: 8, bufferDays: 0.53, rerouteCost: 9 },
  { step: 9, bufferDays: 0.54, rerouteCost: 10 },
  { step: 10, bufferDays: 0.55, rerouteCost: 0 },
  { step: 11, bufferDays: 0.56, rerouteCost: 1 },
  { step: 12, bufferDays: 0.57, rerouteCost: 2 },
  { step: 13, bufferDays: 0.58, rerouteCost: 3 },
  { step: 14, bufferDays: 0.59, rerouteCost: 4 },
  { step: 15, bufferDays: 0.6, rerouteCost: 5 },
  { step: 16, bufferDays: 0.61, rerouteCost: 6 },
  { step: 17, bufferDays: 0.62, rerouteCost: 7 },
  { step: 18, bufferDays: 0.63, rerouteCost: 8 },
  { step: 19, bufferDays: 0.64, rerouteCost: 9 },
  { step: 20, bufferDays: 0.65, rerouteCost: 10 },
  { step: 21, bufferDays: 0.66, rerouteCost: 0 },
  { step: 22, bufferDays: 0.67, rerouteCost: 1 },
  { step: 23, bufferDays: 0.68, rerouteCost: 2 },
  { step: 24, bufferDays: 0.69, rerouteCost: 3 },
  { step: 25, bufferDays: 0.7, rerouteCost: 4 },
  { step: 26, bufferDays: 0.71, rerouteCost: 5 },
  { step: 27, bufferDays: 0.72, rerouteCost: 6 },
  { step: 28, bufferDays: 0.28, rerouteCost: 7 },
  { step: 29, bufferDays: 0.29, rerouteCost: 8 },
  { step: 30, bufferDays: 0.3, rerouteCost: 9 },
  { step: 31, bufferDays: 0.31, rerouteCost: 10 },
  { step: 32, bufferDays: 0.32, rerouteCost: 0 },
  { step: 33, bufferDays: 0.33, rerouteCost: 1 },
] as const;

export function V1019_MTRD_PORT_NODE_01_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1019_MTRD_PORT_NODE_01_STEPS.length; i++) {
    const row = V1019_MTRD_PORT_NODE_01_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }
  return V1019_MTRD_clamp(acc / V1019_MTRD_PORT_NODE_01_STEPS.length, 0, 1);
}

export function V1019_MTRD_PORT_NODE_01_rerouteStress(turn: number): number {
  return V1019_MTRD_clamp(
    V1019_MTRD_PORT_NODE_01_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}
