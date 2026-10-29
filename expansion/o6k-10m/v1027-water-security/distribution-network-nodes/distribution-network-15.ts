import { V1027_WSEC_clamp } from '../engine/water-security-utils.ts';
import type { V1027WsecWaterSecurityBand, V1027WsecRegionId, V1027WsecWaterSecurityChannel } from '../types/core.ts';

export const V1027_WSEC_DISTRIBUTION_NETWORK_15_META = {
  id: 'distribution_network_15',
  regionId: 'ACT' as V1027WsecRegionId,
  anchorChannel: 'specialist_referral' as V1027WsecWaterSecurityChannel,
  defaultBand: 'minimal' as V1027WsecWaterSecurityBand,
} as const;

const V1027_WSEC_DISTRIBUTION_NETWORK_15_STEPS = [
  { step: 0, dwellHours: 0.67, rerouteCost: 2 },
  { step: 1, dwellHours: 0.68, rerouteCost: 3 },
  { step: 2, dwellHours: 0.69, rerouteCost: 4 },
  { step: 3, dwellHours: 0.22, rerouteCost: 5 },
  { step: 4, dwellHours: 0.23, rerouteCost: 6 },
  { step: 5, dwellHours: 0.24, rerouteCost: 7 },
  { step: 6, dwellHours: 0.25, rerouteCost: 8 },
  { step: 7, dwellHours: 0.26, rerouteCost: 9 },
  { step: 8, dwellHours: 0.27, rerouteCost: 10 },
  { step: 9, dwellHours: 0.28, rerouteCost: 11 },
  { step: 10, dwellHours: 0.29, rerouteCost: 12 },
  { step: 11, dwellHours: 0.3, rerouteCost: 0 },
  { step: 12, dwellHours: 0.31, rerouteCost: 1 },
  { step: 13, dwellHours: 0.32, rerouteCost: 2 },
  { step: 14, dwellHours: 0.33, rerouteCost: 3 },
  { step: 15, dwellHours: 0.34, rerouteCost: 4 },
  { step: 16, dwellHours: 0.35, rerouteCost: 5 },
  { step: 17, dwellHours: 0.36, rerouteCost: 6 },
  { step: 18, dwellHours: 0.37, rerouteCost: 7 },
  { step: 19, dwellHours: 0.38, rerouteCost: 8 },
  { step: 20, dwellHours: 0.39, rerouteCost: 9 },
  { step: 21, dwellHours: 0.4, rerouteCost: 10 },
  { step: 22, dwellHours: 0.41, rerouteCost: 11 },
  { step: 23, dwellHours: 0.42, rerouteCost: 12 },
  { step: 24, dwellHours: 0.43, rerouteCost: 0 },
  { step: 25, dwellHours: 0.44, rerouteCost: 1 },
  { step: 26, dwellHours: 0.45, rerouteCost: 2 },
  { step: 27, dwellHours: 0.46, rerouteCost: 3 },
  { step: 28, dwellHours: 0.47, rerouteCost: 4 },
  { step: 29, dwellHours: 0.48, rerouteCost: 5 },
  { step: 30, dwellHours: 0.49, rerouteCost: 6 },
  { step: 31, dwellHours: 0.5, rerouteCost: 7 },
  { step: 32, dwellHours: 0.51, rerouteCost: 8 },
  { step: 33, dwellHours: 0.52, rerouteCost: 9 },
] as const;

export function V1027_WSEC_DISTRIBUTION_NETWORK_15_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1027_WSEC_DISTRIBUTION_NETWORK_15_STEPS.length; i++) {
    const row = V1027_WSEC_DISTRIBUTION_NETWORK_15_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1027_WSEC_clamp(acc / V1027_WSEC_DISTRIBUTION_NETWORK_15_STEPS.length, 0, 1);
}

export function V1027_WSEC_DISTRIBUTION_NETWORK_15_rerouteStress(turn: number): number {
  return V1027_WSEC_clamp(
    V1027_WSEC_DISTRIBUTION_NETWORK_15_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
