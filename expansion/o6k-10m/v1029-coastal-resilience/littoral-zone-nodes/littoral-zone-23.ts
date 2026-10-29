import { V1029_CRES_clamp } from '../engine/coastal-resilience-utils.ts';
import type { V1029CresAdaptationBand, V1029CresRegionId, V1029CresCoastalAdaptationChannel } from '../types/core.ts';

export const V1029_CRES_LITTORAL_ZONE_23_META = {
  id: 'littoral_zone_23',
  regionId: 'ACT' as V1029CresRegionId,
  anchorChannel: 'telehealth' as V1029CresCoastalAdaptationChannel,
  defaultBand: 'critical' as V1029CresAdaptationBand,
} as const;

const V1029_CRES_LITTORAL_ZONE_23_STEPS = [
  { step: 0, dwellHours: 0.27, rerouteCost: 10 },
  { step: 1, dwellHours: 0.28, rerouteCost: 11 },
  { step: 2, dwellHours: 0.29, rerouteCost: 12 },
  { step: 3, dwellHours: 0.3, rerouteCost: 0 },
  { step: 4, dwellHours: 0.31, rerouteCost: 1 },
  { step: 5, dwellHours: 0.32, rerouteCost: 2 },
  { step: 6, dwellHours: 0.33, rerouteCost: 3 },
  { step: 7, dwellHours: 0.34, rerouteCost: 4 },
  { step: 8, dwellHours: 0.35, rerouteCost: 5 },
  { step: 9, dwellHours: 0.36, rerouteCost: 6 },
  { step: 10, dwellHours: 0.37, rerouteCost: 7 },
  { step: 11, dwellHours: 0.38, rerouteCost: 8 },
  { step: 12, dwellHours: 0.39, rerouteCost: 9 },
  { step: 13, dwellHours: 0.4, rerouteCost: 10 },
  { step: 14, dwellHours: 0.41, rerouteCost: 11 },
  { step: 15, dwellHours: 0.42, rerouteCost: 12 },
  { step: 16, dwellHours: 0.43, rerouteCost: 0 },
  { step: 17, dwellHours: 0.44, rerouteCost: 1 },
  { step: 18, dwellHours: 0.45, rerouteCost: 2 },
  { step: 19, dwellHours: 0.46, rerouteCost: 3 },
  { step: 20, dwellHours: 0.47, rerouteCost: 4 },
  { step: 21, dwellHours: 0.48, rerouteCost: 5 },
  { step: 22, dwellHours: 0.49, rerouteCost: 6 },
  { step: 23, dwellHours: 0.5, rerouteCost: 7 },
  { step: 24, dwellHours: 0.51, rerouteCost: 8 },
  { step: 25, dwellHours: 0.52, rerouteCost: 9 },
  { step: 26, dwellHours: 0.53, rerouteCost: 10 },
  { step: 27, dwellHours: 0.54, rerouteCost: 11 },
  { step: 28, dwellHours: 0.55, rerouteCost: 12 },
  { step: 29, dwellHours: 0.56, rerouteCost: 0 },
  { step: 30, dwellHours: 0.57, rerouteCost: 1 },
  { step: 31, dwellHours: 0.58, rerouteCost: 2 },
  { step: 32, dwellHours: 0.59, rerouteCost: 3 },
  { step: 33, dwellHours: 0.6, rerouteCost: 4 },
] as const;

export function V1029_CRES_LITTORAL_ZONE_23_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1029_CRES_LITTORAL_ZONE_23_STEPS.length; i++) {
    const row = V1029_CRES_LITTORAL_ZONE_23_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1029_CRES_clamp(acc / V1029_CRES_LITTORAL_ZONE_23_STEPS.length, 0, 1);
}

export function V1029_CRES_LITTORAL_ZONE_23_rerouteStress(turn: number): number {
  return V1029_CRES_clamp(
    V1029_CRES_LITTORAL_ZONE_23_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
