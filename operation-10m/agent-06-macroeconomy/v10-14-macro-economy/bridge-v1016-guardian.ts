import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroGuardianSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 guardian co-pilot spillover (distinct from credit layer; never mutates guardian state). */
export function readMacroGuardianSpilloverFromV1016Guardian(inputs: MacroEconomyInputs): MacroGuardianSpillover {
  const g: any =
    inputs.guardianCopilot ??
    inputs.guardian ??
    inputs.coPilotWarnings ??
    inputs.nationalSystems?.guardian;
  if (!g) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const alertBand = String(g.alertBand ?? g.riskBand ?? g.overallRisk?.band ?? '');
  const openWarnings = Math.max(0, Math.floor(Number(g.openWarningCount ?? g.activeWarnings ?? g.warningCount ?? 0)));
  const confidence = String(g.guidanceConfidence?.band ?? g.confidenceBand ?? '');

  if (alertBand === 'critical' || alertBand === 'severe' || alertBand === 'red') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Guardian alert band (${alertBand}) drags macro cycle and investment read.`;
  } else if (alertBand === 'elevated' || alertBand === 'amber' || alertBand === 'watch') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Elevated guardian alerts (${alertBand}) cap macro upside interpretation.`;
  } else if (alertBand === 'calm' || alertBand === 'green' || alertBand === 'clear') {
    cycleNudge += 0.5;
    summary = 'Calm guardian backdrop supports stable macro read.';
  }

  if (openWarnings >= 5) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + `${openWarnings} open guardian warnings amplify macro downside risk.`;
  } else if (openWarnings >= 3) {
    cycleNudge -= 1;
  }

  if (confidence === 'low' || confidence === 'uncertain') {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Low guardian guidance confidence reduces investment conviction read.';
  } else if (confidence === 'high' || confidence === 'strong') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroGuardianSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroGuardianSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
