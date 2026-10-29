import { V1017_ICLOG_clamp } from '../engine/intercity-logistics-utils.ts';
import type { V1017IclogHubBand, V1017IclogRegionId, V1017IclogSystemDomain } from '../types/core.ts';

export const V1017_ICLOG_HUB_NODE_19_META = {
  id: 'hub_19',
  regionId: 'WA' as V1017IclogRegionId,
  anchorSystem: 'finance' as V1017IclogSystemDomain,
  defaultBand: 'recovering' as V1017IclogHubBand,
} as const;

const V1017_ICLOG_HUB_NODE_19_STEPS = [
  { step: 0, bufferDays: 0.36, rerouteCost: 8 },
  { step: 1, bufferDays: 0.37, rerouteCost: 9 },
  { step: 2, bufferDays: 0.38, rerouteCost: 10 },
  { step: 3, bufferDays: 0.39, rerouteCost: 0 },
  { step: 4, bufferDays: 0.4, rerouteCost: 1 },
  { step: 5, bufferDays: 0.41, rerouteCost: 2 },
  { step: 6, bufferDays: 0.42, rerouteCost: 3 },
  { step: 7, bufferDays: 0.43, rerouteCost: 4 },
  { step: 8, bufferDays: 0.44, rerouteCost: 5 },
  { step: 9, bufferDays: 0.45, rerouteCost: 6 },
  { step: 10, bufferDays: 0.46, rerouteCost: 7 },
  { step: 11, bufferDays: 0.47, rerouteCost: 8 },
  { step: 12, bufferDays: 0.48, rerouteCost: 9 },
  { step: 13, bufferDays: 0.49, rerouteCost: 10 },
  { step: 14, bufferDays: 0.5, rerouteCost: 0 },
  { step: 15, bufferDays: 0.51, rerouteCost: 1 },
  { step: 16, bufferDays: 0.52, rerouteCost: 2 },
  { step: 17, bufferDays: 0.53, rerouteCost: 3 },
  { step: 18, bufferDays: 0.54, rerouteCost: 4 },
  { step: 19, bufferDays: 0.55, rerouteCost: 5 },
  { step: 20, bufferDays: 0.56, rerouteCost: 6 },
  { step: 21, bufferDays: 0.57, rerouteCost: 7 },
  { step: 22, bufferDays: 0.58, rerouteCost: 8 },
  { step: 23, bufferDays: 0.59, rerouteCost: 9 },
  { step: 24, bufferDays: 0.6, rerouteCost: 10 },
  { step: 25, bufferDays: 0.61, rerouteCost: 0 },
  { step: 26, bufferDays: 0.62, rerouteCost: 1 },
  { step: 27, bufferDays: 0.63, rerouteCost: 2 },
  { step: 28, bufferDays: 0.64, rerouteCost: 3 },
  { step: 29, bufferDays: 0.65, rerouteCost: 4 },
  { step: 30, bufferDays: 0.66, rerouteCost: 5 },
  { step: 31, bufferDays: 0.67, rerouteCost: 6 },
  { step: 32, bufferDays: 0.68, rerouteCost: 7 },
  { step: 33, bufferDays: 0.69, rerouteCost: 8 },
] as const;

export function V1017_ICLOG_HUB_NODE_19_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1017_ICLOG_HUB_NODE_19_STEPS.length; i++) {
    const row = V1017_ICLOG_HUB_NODE_19_STEPS[i];
    acc += row.bufferDays * (1 + (turn + row.step) % 6) * 0.018;
  }
  return V1017_ICLOG_clamp(acc / V1017_ICLOG_HUB_NODE_19_STEPS.length, 0, 1);
}

export function V1017_ICLOG_HUB_NODE_19_rerouteStress(turn: number): number {
  return V1017_ICLOG_clamp(
    V1017_ICLOG_HUB_NODE_19_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 4)), 0) / 48,
    0,
    28,
  );
}
