import { V1030_IHEAT_clamp } from '../engine/inland-heat-utils.ts';
import type { V1030IheatAridAdaptationBand, V1030IheatRegionId, V1030IheatInlandHeatChannel } from '../types/core.ts';

export const V1030_IHEAT_INLAND_ZONE_13_META = {
  id: 'inland_zone_13',
  regionId: 'TAS' as V1030IheatRegionId,
  anchorChannel: 'telehealth' as V1030IheatInlandHeatChannel,
  defaultBand: 'critical' as V1030IheatAridAdaptationBand,
} as const;

const V1030_IHEAT_INLAND_ZONE_13_STEPS = [
  { step: 0, dwellHours: 0.29, rerouteCost: 0 },
  { step: 1, dwellHours: 0.3, rerouteCost: 1 },
  { step: 2, dwellHours: 0.31, rerouteCost: 2 },
  { step: 3, dwellHours: 0.32, rerouteCost: 3 },
  { step: 4, dwellHours: 0.33, rerouteCost: 4 },
  { step: 5, dwellHours: 0.34, rerouteCost: 5 },
  { step: 6, dwellHours: 0.35, rerouteCost: 6 },
  { step: 7, dwellHours: 0.36, rerouteCost: 7 },
  { step: 8, dwellHours: 0.37, rerouteCost: 8 },
  { step: 9, dwellHours: 0.38, rerouteCost: 9 },
  { step: 10, dwellHours: 0.39, rerouteCost: 10 },
  { step: 11, dwellHours: 0.4, rerouteCost: 11 },
  { step: 12, dwellHours: 0.41, rerouteCost: 12 },
  { step: 13, dwellHours: 0.42, rerouteCost: 0 },
  { step: 14, dwellHours: 0.43, rerouteCost: 1 },
  { step: 15, dwellHours: 0.44, rerouteCost: 2 },
  { step: 16, dwellHours: 0.45, rerouteCost: 3 },
  { step: 17, dwellHours: 0.46, rerouteCost: 4 },
  { step: 18, dwellHours: 0.47, rerouteCost: 5 },
  { step: 19, dwellHours: 0.48, rerouteCost: 6 },
  { step: 20, dwellHours: 0.49, rerouteCost: 7 },
  { step: 21, dwellHours: 0.5, rerouteCost: 8 },
  { step: 22, dwellHours: 0.51, rerouteCost: 9 },
  { step: 23, dwellHours: 0.52, rerouteCost: 10 },
  { step: 24, dwellHours: 0.53, rerouteCost: 11 },
  { step: 25, dwellHours: 0.54, rerouteCost: 12 },
  { step: 26, dwellHours: 0.55, rerouteCost: 0 },
  { step: 27, dwellHours: 0.56, rerouteCost: 1 },
  { step: 28, dwellHours: 0.57, rerouteCost: 2 },
  { step: 29, dwellHours: 0.58, rerouteCost: 3 },
  { step: 30, dwellHours: 0.59, rerouteCost: 4 },
  { step: 31, dwellHours: 0.6, rerouteCost: 5 },
  { step: 32, dwellHours: 0.61, rerouteCost: 6 },
  { step: 33, dwellHours: 0.62, rerouteCost: 7 },
] as const;

export function V1030_IHEAT_INLAND_ZONE_13_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1030_IHEAT_INLAND_ZONE_13_STEPS.length; i++) {
    const row = V1030_IHEAT_INLAND_ZONE_13_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1030_IHEAT_clamp(acc / V1030_IHEAT_INLAND_ZONE_13_STEPS.length, 0, 1);
}

export function V1030_IHEAT_INLAND_ZONE_13_rerouteStress(turn: number): number {
  return V1030_IHEAT_clamp(
    V1030_IHEAT_INLAND_ZONE_13_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
