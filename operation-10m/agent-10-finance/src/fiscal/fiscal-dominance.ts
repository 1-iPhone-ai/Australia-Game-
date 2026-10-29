import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FiscalDominanceBand = 'contained' | 'elevated' | 'dominant';

export interface FiscalDominanceAssessment {
  band: FiscalDominanceBand;
  dominanceScore: number;
  monetaryPolicyOffset: number;
  narrative: string;
  dampensAnchoring: boolean;
}

/** When fiscal stress overwhelms nominal anchor — metadata for guardian / debrief only. */
export function assessFiscalDominance(inputs: MacroFinancialSystemInputs): FiscalDominanceAssessment {
  let score = 0.12;

  if (inputs.fiscalPressure === 'critical') score += 0.38;
  else if (inputs.fiscalPressure === 'strained') score += 0.22;
  else if (inputs.fiscalPressure === 'tight') score += 0.08;

  if (inputs.sovereignDebtPressure === 'high') score += 0.18;
  if (inputs.fiscalSustainability === 'vulnerable') score += 0.12;
  if ((inputs.activeCrises ?? 0) >= 2) score += 0.08;
  if (inputs.highInflationScenario) score += 0.06;

  const clamped = finClamp(score, 0, 1);
  const band: FiscalDominanceBand =
    clamped >= 0.62 ? 'dominant' : clamped >= 0.35 ? 'elevated' : 'contained';

  const monetaryPolicyOffset = finRound(finClamp(1 - clamped * 0.45, 0.55, 1), 3);
  const dampensAnchoring = band !== 'contained';

  const narrative =
    band === 'dominant'
      ? 'Fiscal imperatives are dominating — monetary anchor effectiveness reduced (macro CPI channel).'
      : band === 'elevated'
        ? 'Fiscal pressure is bleeding into inflation expectations.'
        : 'Fiscal dominance contained; monetary transmission nominal.';

  return {
    band,
    dominanceScore: finRound(clamped, 3),
    monetaryPolicyOffset,
    narrative,
    dampensAnchoring,
  };
}
