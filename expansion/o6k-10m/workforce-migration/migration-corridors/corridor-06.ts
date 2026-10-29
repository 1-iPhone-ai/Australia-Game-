import { V1014_WORKFORCE_clamp } from '../engine/workforce-migration-utils.ts';
import type { V1014WorkforceMigrationFlowBand, V1014WorkforceRegionId } from '../types/core.ts';

export const V1014_WORKFORCE_CORRIDOR_06_META = {
  id: 'corr_06',
  origin: 'NT' as V1014WorkforceRegionId,
  destination: 'NSW' as V1014WorkforceRegionId,
  defaultBand: 'constrained' as V1014WorkforceMigrationFlowBand,
} as const;

const V1014_WORKFORCE_CORRIDOR_06_STEPS = [
  { step: 0, capacity: 0.73, backlogTurns: 6 },
  { step: 1, capacity: 0.74, backlogTurns: 7 },
  { step: 2, capacity: 0.35, backlogTurns: 8 },
  { step: 3, capacity: 0.36, backlogTurns: 0 },
  { step: 4, capacity: 0.37, backlogTurns: 1 },
  { step: 5, capacity: 0.38, backlogTurns: 2 },
  { step: 6, capacity: 0.39, backlogTurns: 3 },
  { step: 7, capacity: 0.4, backlogTurns: 4 },
  { step: 8, capacity: 0.41, backlogTurns: 5 },
  { step: 9, capacity: 0.42, backlogTurns: 6 },
  { step: 10, capacity: 0.43, backlogTurns: 7 },
  { step: 11, capacity: 0.44, backlogTurns: 8 },
  { step: 12, capacity: 0.45, backlogTurns: 0 },
  { step: 13, capacity: 0.46, backlogTurns: 1 },
  { step: 14, capacity: 0.47, backlogTurns: 2 },
  { step: 15, capacity: 0.48, backlogTurns: 3 },
  { step: 16, capacity: 0.49, backlogTurns: 4 },
  { step: 17, capacity: 0.5, backlogTurns: 5 },
  { step: 18, capacity: 0.51, backlogTurns: 6 },
  { step: 19, capacity: 0.52, backlogTurns: 7 },
  { step: 20, capacity: 0.53, backlogTurns: 8 },
  { step: 21, capacity: 0.54, backlogTurns: 0 },
  { step: 22, capacity: 0.55, backlogTurns: 1 },
  { step: 23, capacity: 0.56, backlogTurns: 2 },
  { step: 24, capacity: 0.57, backlogTurns: 3 },
  { step: 25, capacity: 0.58, backlogTurns: 4 },
  { step: 26, capacity: 0.59, backlogTurns: 5 },
  { step: 27, capacity: 0.6, backlogTurns: 6 },
  { step: 28, capacity: 0.61, backlogTurns: 7 },
  { step: 29, capacity: 0.62, backlogTurns: 8 },
  { step: 30, capacity: 0.63, backlogTurns: 0 },
  { step: 31, capacity: 0.64, backlogTurns: 1 },
] as const;

export function V1014_WORKFORCE_CORRIDOR_06_pressure(turn: number): number {
  let acc = 0;
  for (let i = 0; i < V1014_WORKFORCE_CORRIDOR_06_STEPS.length; i++) {
    const row = V1014_WORKFORCE_CORRIDOR_06_STEPS[i];
    acc += row.capacity * (1 + (turn + row.step) % 5) * 0.02;
  }
  return V1014_WORKFORCE_clamp(acc / V1014_WORKFORCE_CORRIDOR_06_STEPS.length, 0, 1);
}

export function V1014_WORKFORCE_CORRIDOR_06_backlog(turn: number): number {
  return V1014_WORKFORCE_clamp(
    V1014_WORKFORCE_CORRIDOR_06_STEPS.reduce((sum, row) => sum + row.backlogTurns * (1 + ((turn + row.step) % 3)), 0) / 40,
    0,
    24,
  );
}
