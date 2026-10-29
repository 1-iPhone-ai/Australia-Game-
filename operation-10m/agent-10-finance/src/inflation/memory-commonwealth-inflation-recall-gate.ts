import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MemoryCommonwealthInflationRecallGateBand =
  | 'anchored'
  | 'stressed'
  | 'breached'
  | 'commonwealth_shock';

export interface MemoryCommonwealthInflationRecallGateAssessment {
  gateBand: MemoryCommonwealthInflationRecallGateBand;
  recallIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** AI memory commonwealth inflation recall gate (Agent 19). */
export function assessMemoryCommonwealthInflationRecallGate(input: {
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  explainabilityAlertActive: boolean;
  memoryCommonwealthInflationLatch: boolean;
  realmRecallGateBand: 'sealed' | 'opening' | 'breached';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MemoryCommonwealthInflationRecallGateAssessment {
  let pressure = 0;
  if (input.narrativeDriftTowardHigherInflation) pressure += 0.16;
  if (input.explainabilityAlertActive) pressure += 0.1;
  pressure += finClamp(input.recalledInflationRegimeConfidence, 0, 1) * 0.22;
  if (input.memoryCommonwealthInflationLatch) pressure += 0.14;
  if (input.realmRecallGateBand === 'breached') pressure += 0.24;
  else if (input.realmRecallGateBand === 'opening') pressure += 0.11;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0034, 0, 1.05);
  const recallIndex = finRound(100 + pressure * 17, 1);

  let gateBand: MemoryCommonwealthInflationRecallGateBand = 'anchored';
  if (pressure >= 0.57) gateBand = 'commonwealth_shock';
  else if (pressure >= 0.38) gateBand = 'breached';
  else if (pressure >= 0.17) gateBand = 'stressed';

  const inflationScoreNudge =
    gateBand === 'commonwealth_shock'
      ? 0.092
      : gateBand === 'breached'
        ? 0.059
        : gateBand === 'stressed'
          ? 0.028
          : 0;

  const narrative =
    gateBand === 'commonwealth_shock' || gateBand === 'breached'
      ? 'Commonwealth memory recall gate feeding CPI metadata alerts.'
      : gateBand === 'stressed'
        ? 'Realm recall latch building under explainability drift.'
        : 'Memory commonwealth inflation recall gate calm versus headline CPI.';

  return { gateBand, recallIndex, inflationScoreNudge, narrative };
}

export function memoryCommonwealthInflationRecallGateScoreAdjustment(
  band: MemoryCommonwealthInflationRecallGateBand,
): number {
  if (band === 'commonwealth_shock') return 4;
  if (band === 'breached') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
