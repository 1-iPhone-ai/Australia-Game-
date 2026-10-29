import { V1034_CIRES_clamp } from '../engine/critical-infrastructure-resilience-utils.ts';
import type { V1034CiresCriticalInfrastructureResilienceBand, V1034CiresRegionId, V1034CiresCriticalInfrastructureResilienceChannel } from '../types/core.ts';

export const V1034_CIRES_FACILITY_ZONE_09_META = {
  id: 'facility_zone_09',
  regionId: 'VIC' as V1034CiresRegionId,
  anchorChannel: 'remote' as V1034CiresCriticalInfrastructureResilienceChannel,
  defaultBand: 'recovering' as V1034CiresCriticalInfrastructureResilienceBand,
} as const;

const V1034_CIRES_FACILITY_ZONE_09_STEPS = [
  { step: 0, dwellHours: 0.49, rerouteCost: 9 },
  { step: 1, dwellHours: 0.5, rerouteCost: 10 },
  { step: 2, dwellHours: 0.51, rerouteCost: 11 },
  { step: 3, dwellHours: 0.52, rerouteCost: 12 },
  { step: 4, dwellHours: 0.53, rerouteCost: 0 },
  { step: 5, dwellHours: 0.54, rerouteCost: 1 },
  { step: 6, dwellHours: 0.55, rerouteCost: 2 },
  { step: 7, dwellHours: 0.56, rerouteCost: 3 },
  { step: 8, dwellHours: 0.57, rerouteCost: 4 },
  { step: 9, dwellHours: 0.58, rerouteCost: 5 },
  { step: 10, dwellHours: 0.59, rerouteCost: 6 },
  { step: 11, dwellHours: 0.6, rerouteCost: 7 },
  { step: 12, dwellHours: 0.61, rerouteCost: 8 },
  { step: 13, dwellHours: 0.62, rerouteCost: 9 },
  { step: 14, dwellHours: 0.63, rerouteCost: 10 },
  { step: 15, dwellHours: 0.64, rerouteCost: 11 },
  { step: 16, dwellHours: 0.65, rerouteCost: 12 },
  { step: 17, dwellHours: 0.66, rerouteCost: 0 },
  { step: 18, dwellHours: 0.67, rerouteCost: 1 },
  { step: 19, dwellHours: 0.68, rerouteCost: 2 },
  { step: 20, dwellHours: 0.69, rerouteCost: 3 },
  { step: 21, dwellHours: 0.22, rerouteCost: 4 },
  { step: 22, dwellHours: 0.23, rerouteCost: 5 },
  { step: 23, dwellHours: 0.24, rerouteCost: 6 },
  { step: 24, dwellHours: 0.25, rerouteCost: 7 },
  { step: 25, dwellHours: 0.26, rerouteCost: 8 },
  { step: 26, dwellHours: 0.27, rerouteCost: 9 },
  { step: 27, dwellHours: 0.28, rerouteCost: 10 },
  { step: 28, dwellHours: 0.29, rerouteCost: 11 },
  { step: 29, dwellHours: 0.3, rerouteCost: 12 },
  { step: 30, dwellHours: 0.31, rerouteCost: 0 },
  { step: 31, dwellHours: 0.32, rerouteCost: 1 },
  { step: 32, dwellHours: 0.33, rerouteCost: 2 },
  { step: 33, dwellHours: 0.34, rerouteCost: 3 },
] as const;

export function V1034_CIRES_FACILITY_ZONE_09_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1034_CIRES_FACILITY_ZONE_09_STEPS.length; i++) {
    const row = V1034_CIRES_FACILITY_ZONE_09_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1034_CIRES_clamp(acc / V1034_CIRES_FACILITY_ZONE_09_STEPS.length, 0, 1);
}

export function V1034_CIRES_FACILITY_ZONE_09_rerouteStress(turn: number): number {
  return V1034_CIRES_clamp(
    V1034_CIRES_FACILITY_ZONE_09_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
