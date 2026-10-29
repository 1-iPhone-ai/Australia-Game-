import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TransportFreightInflationGridlockSurgeBand = 'clear' | 'building' | 'surge' | 'gridlock_crisis';

export interface TransportFreightInflationGridlockSurgeAssessment {
  surgeBand: TransportFreightInflationGridlockSurgeBand;
  gridlockIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Transport freight inflation gridlock surge (Agent 12, round 44). */
export function assessTransportFreightInflationGridlockSurge(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  wave44FreightGridlockLatch: boolean;
  freightGridlockSurgeBand: 'clear' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportFreightInflationGridlockSurgeAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.22;
  else if (input.freightCapacityBand === 'tight') pressure += 0.12;
  if (input.fuelSurchargeActive) pressure += 0.15;
  if (input.wave44FreightGridlockLatch) pressure += 0.13;
  if (input.freightGridlockSurgeBand === 'ruptured') pressure += 0.21;
  else if (input.freightGridlockSurgeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const gridlockIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: TransportFreightInflationGridlockSurgeBand = 'clear';
  if (pressure >= 0.57) surgeBand = 'gridlock_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'gridlock_crisis'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'gridlock_crisis' || surgeBand === 'surge'
      ? 'Freight gridlock surge feeding CPI logistics metadata.'
      : surgeBand === 'building'
        ? 'Freight gridlock latch building under capacity stress.'
        : 'Transport freight gridlock surge clear versus headline CPI.';

  return { surgeBand, gridlockIndex, inflationScoreNudge, narrative };
}

export function transportFreightInflationGridlockSurgeScoreAdjustment(
  band: TransportFreightInflationGridlockSurgeBand,
): number {
  if (band === 'gridlock_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
