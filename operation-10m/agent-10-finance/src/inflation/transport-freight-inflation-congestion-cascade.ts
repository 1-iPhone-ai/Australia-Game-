import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TransportFreightInflationCongestionCascadeBand =
  | 'clear'
  | 'building'
  | 'gridlocked'
  | 'logistics_rupture';

export interface TransportFreightInflationCongestionCascadeAssessment {
  cascadeBand: TransportFreightInflationCongestionCascadeBand;
  congestionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Transport freight inflation congestion cascade (Agent 12). */
export function assessTransportFreightInflationCongestionCascade(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  wave36LogisticsInflationLatch: boolean;
  freightCascadeCongestionBand: 'clear' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportFreightInflationCongestionCascadeAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.24;
  else if (input.freightCapacityBand === 'tight') pressure += 0.14;
  if (input.fuelSurchargeActive) pressure += 0.12;
  if (input.portBacklogBand === 'severe') pressure += 0.18;
  else if (input.portBacklogBand === 'moderate') pressure += 0.08;
  if (input.wave36LogisticsInflationLatch) pressure += 0.13;
  if (input.freightCascadeCongestionBand === 'ruptured') pressure += 0.22;
  else if (input.freightCascadeCongestionBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const congestionIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: TransportFreightInflationCongestionCascadeBand = 'clear';
  if (pressure >= 0.57) cascadeBand = 'logistics_rupture';
  else if (pressure >= 0.38) cascadeBand = 'gridlocked';
  else if (pressure >= 0.17) cascadeBand = 'building';

  const inflationScoreNudge =
    cascadeBand === 'logistics_rupture'
      ? 0.091
      : cascadeBand === 'gridlocked'
        ? 0.058
        : cascadeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'logistics_rupture' || cascadeBand === 'gridlocked'
      ? 'Freight congestion cascade elevating CPI logistics metadata.'
      : cascadeBand === 'building'
        ? 'Port backlog building logistics inflation latch.'
        : 'Transport freight congestion clear versus headline CPI.';

  return { cascadeBand, congestionIndex, inflationScoreNudge, narrative };
}

export function transportFreightInflationCongestionCascadeScoreAdjustment(
  band: TransportFreightInflationCongestionCascadeBand,
): number {
  if (band === 'logistics_rupture') return 4;
  if (band === 'gridlocked') return 3;
  if (band === 'building') return 2;
  return 0;
}
