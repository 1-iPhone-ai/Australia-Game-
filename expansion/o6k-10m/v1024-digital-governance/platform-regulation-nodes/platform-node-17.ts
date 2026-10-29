import { V1024_DGOV_clamp } from '../engine/digital-governance-utils.ts';
import type { V1024DgovGovernanceBand, V1024DgovRegionId, V1024DgovGovernanceChannel } from '../types/core.ts';

export const V1024_DGOV_PLATFORM_NODE_17_META = {
  id: 'platform_node_17',
  regionId: 'VIC' as V1024DgovRegionId,
  anchorChannel: 'genai_disclosure' as V1024DgovGovernanceChannel,
  defaultBand: 'elevated' as V1024DgovGovernanceBand,
} as const;

const V1024_DGOV_PLATFORM_NODE_17_STEPS = [
  { step: 0, dwellHours: 0.57, rerouteCost: 4 },
  { step: 1, dwellHours: 0.58, rerouteCost: 5 },
  { step: 2, dwellHours: 0.59, rerouteCost: 6 },
  { step: 3, dwellHours: 0.6, rerouteCost: 7 },
  { step: 4, dwellHours: 0.61, rerouteCost: 8 },
  { step: 5, dwellHours: 0.62, rerouteCost: 9 },
  { step: 6, dwellHours: 0.63, rerouteCost: 10 },
  { step: 7, dwellHours: 0.64, rerouteCost: 11 },
  { step: 8, dwellHours: 0.65, rerouteCost: 12 },
  { step: 9, dwellHours: 0.66, rerouteCost: 0 },
  { step: 10, dwellHours: 0.67, rerouteCost: 1 },
  { step: 11, dwellHours: 0.68, rerouteCost: 2 },
  { step: 12, dwellHours: 0.69, rerouteCost: 3 },
  { step: 13, dwellHours: 0.22, rerouteCost: 4 },
  { step: 14, dwellHours: 0.23, rerouteCost: 5 },
  { step: 15, dwellHours: 0.24, rerouteCost: 6 },
  { step: 16, dwellHours: 0.25, rerouteCost: 7 },
  { step: 17, dwellHours: 0.26, rerouteCost: 8 },
  { step: 18, dwellHours: 0.27, rerouteCost: 9 },
  { step: 19, dwellHours: 0.28, rerouteCost: 10 },
  { step: 20, dwellHours: 0.29, rerouteCost: 11 },
  { step: 21, dwellHours: 0.3, rerouteCost: 12 },
  { step: 22, dwellHours: 0.31, rerouteCost: 0 },
  { step: 23, dwellHours: 0.32, rerouteCost: 1 },
  { step: 24, dwellHours: 0.33, rerouteCost: 2 },
  { step: 25, dwellHours: 0.34, rerouteCost: 3 },
  { step: 26, dwellHours: 0.35, rerouteCost: 4 },
  { step: 27, dwellHours: 0.36, rerouteCost: 5 },
  { step: 28, dwellHours: 0.37, rerouteCost: 6 },
  { step: 29, dwellHours: 0.38, rerouteCost: 7 },
  { step: 30, dwellHours: 0.39, rerouteCost: 8 },
  { step: 31, dwellHours: 0.4, rerouteCost: 9 },
  { step: 32, dwellHours: 0.41, rerouteCost: 10 },
  { step: 33, dwellHours: 0.42, rerouteCost: 11 },
] as const;

export function V1024_DGOV_PLATFORM_NODE_17_buffer(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1024_DGOV_PLATFORM_NODE_17_STEPS.length; i++) {
    const row = V1024_DGOV_PLATFORM_NODE_17_STEPS[i];
    acc += row.dwellHours * (1 + (turn + row.step) % 7) * 0.016;
  }
  return V1024_DGOV_clamp(acc / V1024_DGOV_PLATFORM_NODE_17_STEPS.length, 0, 1);
}

export function V1024_DGOV_PLATFORM_NODE_17_rerouteStress(turn: number): number {
  return V1024_DGOV_clamp(
    V1024_DGOV_PLATFORM_NODE_17_STEPS.reduce((sum, row) => sum + row.rerouteCost * (1 + ((turn + row.step) % 5)), 0) / 52,
    0,
    32,
  );
}
