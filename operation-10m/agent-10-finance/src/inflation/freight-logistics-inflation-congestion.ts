import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FreightLogisticsInflationCongestionBand = 'clear' | 'building' | 'congested' | 'gridlocked';

export interface FreightLogisticsInflationCongestionAssessment {
  congestionBand: FreightLogisticsInflationCongestionBand;
  logisticsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Freight capacity and port backlog inflation congestion (Agent 12). */
export function assessFreightLogisticsInflationCongestion(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  logisticsInflationLatch: boolean;
  freightCongestionBand: 'clear' | 'building' | 'gridlocked';
  inflationBand: InflationConditionsBand;
  turn: number;
}): FreightLogisticsInflationCongestionAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') {
    pressure += 0.24;
  } else if (input.freightCapacityBand === 'tight') {
    pressure += 0.14;
  } else if (input.freightCapacityBand === 'balanced') {
    pressure += 0.05;
  }
  if (input.fuelSurchargeActive) {
    pressure += 0.12;
  }
  if (input.portBacklogBand === 'severe') {
    pressure += 0.18;
  } else if (input.portBacklogBand === 'moderate') {
    pressure += 0.08;
  }
  if (input.logisticsInflationLatch) {
    pressure += 0.13;
  }
  if (input.freightCongestionBand === 'gridlocked') {
    pressure += 0.22;
  } else if (input.freightCongestionBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const logisticsIndex = finRound(100 + pressure * 16, 1);

  let congestionBand: FreightLogisticsInflationCongestionBand = 'clear';
  if (pressure >= 0.56) congestionBand = 'gridlocked';
  else if (pressure >= 0.36) congestionBand = 'congested';
  else if (pressure >= 0.16) congestionBand = 'building';

  const inflationScoreNudge =
    congestionBand === 'gridlocked'
      ? 0.091
      : congestionBand === 'congested'
        ? 0.057
        : congestionBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    congestionBand === 'gridlocked' || congestionBand === 'congested'
      ? 'Freight and port congestion lifting logistics-side CPI metadata.'
      : congestionBand === 'building'
        ? 'Logistics inflation latch building across transport capacity bands.'
        : 'Freight logistics congestion clear versus headline CPI.';

  return { congestionBand, logisticsIndex, inflationScoreNudge, narrative };
}

export function freightLogisticsInflationCongestionScoreAdjustment(
  band: FreightLogisticsInflationCongestionBand,
): number {
  if (band === 'gridlocked') return 4;
  if (band === 'congested') return 3;
  if (band === 'building') return 2;
  return 0;
}
