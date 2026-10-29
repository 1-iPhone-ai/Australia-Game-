import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TransportLogisticsPressureBand = 'smooth' | 'congested' | 'bottleneck' | 'crisis';

export interface TransportLogisticsInflationAssessment {
  pressureBand: TransportLogisticsPressureBand;
  freightIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Freight and logistics channel into macro CPI (fuel-linked services, not resource board). */
export function assessTransportLogisticsInflation(input: {
  freightCapacityBand: 'ample' | 'balanced' | 'tight' | 'critical';
  fuelSurchargeActive: boolean;
  portBacklogBand: 'clear' | 'moderate' | 'severe';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TransportLogisticsInflationAssessment {
  let pressure = 0;
  if (input.freightCapacityBand === 'critical') pressure += 0.4;
  else if (input.freightCapacityBand === 'tight') pressure += 0.26;
  else if (input.freightCapacityBand === 'balanced') pressure += 0.08;

  if (input.fuelSurchargeActive) pressure += 0.18;
  if (input.portBacklogBand === 'severe') pressure += 0.24;
  else if (input.portBacklogBand === 'moderate') pressure += 0.12;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.006, 0, 1.05);
  const freightIndex = finRound(100 + pressure * 20, 1);

  let pressureBand: TransportLogisticsPressureBand = 'smooth';
  if (pressure >= 0.65) pressureBand = 'crisis';
  else if (pressure >= 0.42) pressureBand = 'bottleneck';
  else if (pressure >= 0.22) pressureBand = 'congested';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.11
      : pressureBand === 'bottleneck'
        ? 0.08
        : pressureBand === 'congested'
          ? 0.04
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'bottleneck'
      ? 'Transport and logistics bottlenecks are feeding goods inflation and delivery surcharges.'
      : pressureBand === 'congested'
        ? 'Freight congestion building — fuel surcharges and backlog risk elevated.'
        : 'Transport logistics inflation smooth relative to domestic demand.';

  return { pressureBand, freightIndex, inflationScoreNudge, narrative };
}

export function transportLogisticsInflationScoreAdjustment(band: TransportLogisticsPressureBand): number {
  if (band === 'crisis') return 5;
  if (band === 'bottleneck') return 3;
  if (band === 'congested') return 2;
  return 0;
}
