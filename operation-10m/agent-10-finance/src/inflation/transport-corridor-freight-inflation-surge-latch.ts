import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TransportCorridorFreightInflationSurgeLatchBand =
  | 'clear'
  | 'building'
  | 'surge'
  | 'corridor_rupture';

export interface TransportCorridorFreightInflationSurgeLatchAssessment {
  surgeBand: TransportCorridorFreightInflationSurgeLatchBand;
  corridorIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Transport corridor freight inflation surge latch (Agent 12, round 50). */
export function assessTransportCorridorFreightInflationSurgeLatch(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  wave50FreightCorridorSurgeLatch: boolean;
  corridorFreightSurgeBand: 'clear' | 'building' | 'ruptured';
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportCorridorFreightInflationSurgeLatchAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.21;
  else if (input.freightCapacityBand === 'tight') pressure += 0.12;
  if (input.fuelSurchargeActive) pressure += 0.14;
  if (input.wave50FreightCorridorSurgeLatch) pressure += 0.13;
  if (input.corridorFreightSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.corridorFreightSurgeBand === 'building') pressure += 0.1;
  if (input.portBacklogBand === 'severe') pressure += 0.11;
  else if (input.portBacklogBand === 'moderate') pressure += 0.05;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const corridorIndex = finRound(100 + pressure * 15.8, 1);

  let surgeBand: TransportCorridorFreightInflationSurgeLatchBand = 'clear';
  if (pressure >= 0.57) surgeBand = 'corridor_rupture';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'corridor_rupture'
      ? 0.092
      : surgeBand === 'surge'
        ? 0.059
        : surgeBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    surgeBand === 'corridor_rupture' || surgeBand === 'surge'
      ? 'Transport corridor freight surge latch feeding CPI logistics metadata.'
      : surgeBand === 'building'
        ? 'Corridor freight surge latch building under capacity stress.'
        : 'Transport corridor freight surge latch clear versus headline CPI.';

  return { surgeBand, corridorIndex, inflationScoreNudge, narrative };
}

export function transportCorridorFreightInflationSurgeLatchScoreAdjustment(
  band: TransportCorridorFreightInflationSurgeLatchBand,
): number {
  if (band === 'corridor_rupture') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
