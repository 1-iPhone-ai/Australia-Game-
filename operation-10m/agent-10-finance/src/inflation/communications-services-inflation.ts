import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CommunicationsServicesPressureBand = 'soft' | 'firming' | 'elevated' | 'spike';

export interface CommunicationsServicesInflationAssessment {
  pressureBand: CommunicationsServicesPressureBand;
  commsIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Telecom and digital subscription services in macro CPI metadata. */
export function assessCommunicationsServicesInflation(input: {
  bandwidthDemandBand: 'normal' | 'surge' | 'extreme';
  regulatedTariffShock: boolean;
  platformFeePassThrough: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CommunicationsServicesInflationAssessment {
  let pressure = 0;
  if (input.bandwidthDemandBand === 'extreme') pressure += 0.36;
  else if (input.bandwidthDemandBand === 'surge') pressure += 0.22;

  if (input.regulatedTariffShock) pressure += 0.2;
  if (input.platformFeePassThrough === 'high') pressure += 0.18;
  else if (input.platformFeePassThrough === 'medium') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const commsIndex = finRound(100 + pressure * 16, 1);

  let pressureBand: CommunicationsServicesPressureBand = 'soft';
  if (pressure >= 0.6) pressureBand = 'spike';
  else if (pressure >= 0.38) pressureBand = 'elevated';
  else if (pressure >= 0.18) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'spike'
      ? 0.07
      : pressureBand === 'elevated'
        ? 0.05
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'spike' || pressureBand === 'elevated'
      ? 'Communications and digital services are lifting core services CPI.'
      : pressureBand === 'firming'
        ? 'Comms inflation firming — tariff and platform pass-through building.'
        : 'Communications services inflation soft versus goods channels.';

  return { pressureBand, commsIndex, inflationScoreNudge, narrative };
}

export function communicationsServicesInflationScoreAdjustment(band: CommunicationsServicesPressureBand): number {
  if (band === 'spike') return 4;
  if (band === 'elevated') return 3;
  if (band === 'firming') return 2;
  return 0;
}
