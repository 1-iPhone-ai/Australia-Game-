import { V1031_GRES_clamp } from '../engine/grid-resilience-utils.ts';
import type { V1031GresGridResilienceBand, V1031GresRegionId, V1031GresGridResilienceChannel } from '../types/core.ts';

export const V1031_GRES_SUBSTATION_ZONE_05_META = {
  id: 'substation_zone_05',
  regionId: 'TAS' as V1031GresRegionId,
  anchorChannel: 'specialist_referral' as V1031GresGridResilienceChannel,
  defaultBand: 'minimal' as V1031GresGridResilienceBand,
} as const;

const V1031_GRES_SUBSTATION_ZONE_05_STEPS = [
  { step: 0, dwellHours: 0.69, rerouteCost: 5 },
  { step: 1, dwellHours: 0.22, rerouteCost: 6 },
  { step: 2, dwellHours: 0.23, rerouteCost: 7 },
  { step: 3, dwellHours: 0.24, rerouteCost: 8 },
  { step: 4, dwellHours: 0.25, rerouteCost: 9 },
  { step: 5, dwellHours: 0.26, rerouteCost: 10 },
  { step: 6, dwellHours: 0.27, rerouteCost: 11 },
  { step: 7, dwellHours: 0.28, rerouteCost: 12 },
  { step: 8, dwellHours: 0.29, rerouteCost: 0 },
  { step: 9, dwellHours: 0.3, rerouteCost: 1 },
  { step: 10, dwellHours: 0.31, rerouteCost: 2 },
  { step: 11, dwellHours: 0.32, rerouteCost: 3 },
  { step: 12, dwellHours: 0.33, rerouteCost: 4 },
  { step: 13, dwellHours: 0.34, rerouteCost: 5 },
  { step: 14, dwellHours: 0.35, rerouteCost: 6 },
  { step: 15, dwellHours: 0.36, rerouteCost: 7 },
  { step: 16, dwellHours: 0.37, rerouteCost: 8 },
  { step: 17, dwellHours: 0.38, rerouteCost: 9 },
  { step: 18, dwellHours: 0.39, rerouteCost: 10 },
  { step: 19, dwellHours: 0.4, rerouteCost: 11 },
  { step: 20, dwellHours: 0.41, rerouteCost: 12 },
  { step: 21, dwellHours: 0.42, rerouteCost: 0 },
  { step: 22, dwellHours: 0.43, rerouteCost: 1 },
  { step: 23, dwellHours: 0.44, rerouteCost: 2 },
  { step: 24, dwellHours: 0.45, rerouteCost: 3 },
  { step: 25, dwellHours: 0.46, rerouteCost: 4 },
  { step: 26, dwellHours: 0.47, rerouteCost: 5 },
  { step: 27, dwellHours: 0.48, rerouteCost: 6 },
  { step: 28, dwellHours: 0.49, rerouteCost: 7 },
  { step: 29, dwellHours: 0.5, rerouteCost: 8 },
  { step: 30, dwellHours: 0.51, rerouteCost: 9 },
  { step: 31, dwellHours: 0.52, rerouteCost: 10 },
  { step: 32, dwellHours: 0.53, rerouteCost: 11 },
  { step: 33, dwellHours: 0.54, rerouteCost: 12 },
] as const;

export function V1031_GRES_SUBSTATION_ZONE_05_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1031_GRES_SUBSTATION_ZONE_05_STEPS.length; i++) {
    const row = V1031_GRES_SUBSTATION_ZONE_05_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1031_GRES_clamp(acc / V1031_GRES_SUBSTATION_ZONE_05_STEPS.length, 0, 1);
}

export function V1031_GRES_SUBSTATION_ZONE_05_rerouteStress(turn: number): number {
  return V1031_GRES_clamp(
    V1031_GRES_SUBSTATION_ZONE_05_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
