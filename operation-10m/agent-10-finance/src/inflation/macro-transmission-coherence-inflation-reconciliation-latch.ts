import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MacroTransmissionCoherenceInflationReconciliationLatchBand =
  | 'subdued'
  | 'building'
  | 'latched'
  | 'coherence_crisis';

export interface MacroTransmissionCoherenceInflationReconciliationLatchAssessment {
  latchBand: MacroTransmissionCoherenceInflationReconciliationLatchBand;
  coherenceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro transmission coherence inflation reconciliation latch (Agent 06, round 51). */
export function assessMacroTransmissionCoherenceInflationReconciliationLatch(input: {
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  nominalDemandPressure: number;
  wave51MacroTransmissionCoherenceLatch: boolean;
  transmissionCoherenceEscalationBand: 'stable' | 'elevated' | 'critical';
  transmissionSlippageBand: 'stable' | 'slipping' | 'dislocated';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroTransmissionCoherenceInflationReconciliationLatchAssessment {
  let pressure = 0;
  if (input.gdpGrowthBand === 'strong') pressure += 0.17;
  else if (input.gdpGrowthBand === 'steady' && input.nominalDemandPressure > 0.3) pressure += 0.09;
  if (input.nominalDemandPressure > 0.42) pressure += 0.19;
  else if (input.nominalDemandPressure > 0.22) pressure += 0.1;
  if (input.wave51MacroTransmissionCoherenceLatch) pressure += 0.14;
  if (input.transmissionCoherenceEscalationBand === 'critical') pressure += 0.21;
  else if (input.transmissionCoherenceEscalationBand === 'elevated') pressure += 0.1;
  if (input.transmissionSlippageBand === 'dislocated') pressure += 0.12;
  else if (input.transmissionSlippageBand === 'slipping') pressure += 0.06;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const coherenceIndex = finRound(100 + pressure * 16.1, 1);

  let latchBand: MacroTransmissionCoherenceInflationReconciliationLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'coherence_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'coherence_crisis'
      ? 0.094
      : latchBand === 'latched'
        ? 0.06
        : latchBand === 'building'
          ? 0.029
          : 0;

  const narrative =
    latchBand === 'coherence_crisis' || latchBand === 'latched'
      ? 'Macro transmission coherence latch elevating CPI demand-side reconciliation metadata.'
      : latchBand === 'building'
        ? 'Transmission coherence reconciliation latch building under slippage stress.'
        : 'Macro transmission coherence latch subdued versus headline CPI.';

  return { latchBand, coherenceIndex, inflationScoreNudge, narrative };
}

export function macroTransmissionCoherenceInflationReconciliationLatchScoreAdjustment(
  band: MacroTransmissionCoherenceInflationReconciliationLatchBand,
): number {
  if (band === 'coherence_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
