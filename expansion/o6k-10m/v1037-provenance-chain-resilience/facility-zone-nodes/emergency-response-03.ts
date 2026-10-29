import { V1037_PCRS_clamp } from '../engine/provenance-chain-resilience-utils.ts';
import type { V1037PcresProvenanceChainResilienceBand, V1037PcresRegionId, V1037PcresProvenanceChainResilienceChannel } from '../types/core.ts';

export const V1037_PCRS_FACILITY_ZONE_03_META = {
  id: 'facility_zone_03',
  regionId: 'WA' as V1037PcresRegionId,
  anchorChannel: 'telehealth' as V1037PcresProvenanceChainResilienceChannel,
  defaultBand: 'critical' as V1037PcresProvenanceChainResilienceBand,
} as const;

const V1037_PCRS_FACILITY_ZONE_03_STEPS = [
  { step: 0, dwellHours: 0.31, rerouteCost: 3 },
  { step: 1, dwellHours: 0.32, rerouteCost: 4 },
  { step: 2, dwellHours: 0.33, rerouteCost: 5 },
  { step: 3, dwellHours: 0.34, rerouteCost: 6 },
  { step: 4, dwellHours: 0.35, rerouteCost: 7 },
  { step: 5, dwellHours: 0.36, rerouteCost: 8 },
  { step: 6, dwellHours: 0.37, rerouteCost: 9 },
  { step: 7, dwellHours: 0.38, rerouteCost: 10 },
  { step: 8, dwellHours: 0.39, rerouteCost: 11 },
  { step: 9, dwellHours: 0.4, rerouteCost: 12 },
  { step: 10, dwellHours: 0.41, rerouteCost: 0 },
  { step: 11, dwellHours: 0.42, rerouteCost: 1 },
  { step: 12, dwellHours: 0.43, rerouteCost: 2 },
  { step: 13, dwellHours: 0.44, rerouteCost: 3 },
  { step: 14, dwellHours: 0.45, rerouteCost: 4 },
  { step: 15, dwellHours: 0.46, rerouteCost: 5 },
  { step: 16, dwellHours: 0.47, rerouteCost: 6 },
  { step: 17, dwellHours: 0.48, rerouteCost: 7 },
  { step: 18, dwellHours: 0.49, rerouteCost: 8 },
  { step: 19, dwellHours: 0.5, rerouteCost: 9 },
  { step: 20, dwellHours: 0.51, rerouteCost: 10 },
  { step: 21, dwellHours: 0.52, rerouteCost: 11 },
  { step: 22, dwellHours: 0.53, rerouteCost: 12 },
  { step: 23, dwellHours: 0.54, rerouteCost: 0 },
  { step: 24, dwellHours: 0.55, rerouteCost: 1 },
  { step: 25, dwellHours: 0.56, rerouteCost: 2 },
  { step: 26, dwellHours: 0.57, rerouteCost: 3 },
  { step: 27, dwellHours: 0.58, rerouteCost: 4 },
  { step: 28, dwellHours: 0.59, rerouteCost: 5 },
  { step: 29, dwellHours: 0.6, rerouteCost: 6 },
  { step: 30, dwellHours: 0.61, rerouteCost: 7 },
  { step: 31, dwellHours: 0.62, rerouteCost: 8 },
  { step: 32, dwellHours: 0.63, rerouteCost: 9 },
  { step: 33, dwellHours: 0.64, rerouteCost: 10 },
] as const;

export function V1037_PCRS_FACILITY_ZONE_03_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1037_PCRS_FACILITY_ZONE_03_STEPS.length; i++) {
    const row = V1037_PCRS_FACILITY_ZONE_03_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1037_PCRS_clamp(acc / V1037_PCRS_FACILITY_ZONE_03_STEPS.length, 0, 1);
}

export function V1037_PCRS_FACILITY_ZONE_03_rerouteStress(turn: number): number {
  return V1037_PCRS_clamp(
    V1037_PCRS_FACILITY_ZONE_03_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
