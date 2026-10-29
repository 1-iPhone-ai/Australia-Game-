import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroGuardianVigilanceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 guardian vigilance spillover (Agent 16 domain; distinct from guardian layer). */
export function readMacroGuardianVigilanceSpilloverFromV1016(inputs: MacroEconomyInputs): MacroGuardianVigilanceSpillover {
  const gv: any =
    inputs.guardianVigilance ??
    inputs.guardianCopilot?.vigilance ??
    inputs.guardian?.riskVigilance ??
    inputs.coPilotWarnings?.vigilance;
  if (!gv) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const alert = String(gv.alertBand ?? gv.vigilanceBand ?? gv.postureBand ?? '');
  const coverage = String(gv.coverageBand ?? gv.scopeBand ?? '');
  const trust = String(gv.trustBand ?? gv.calibrationBand ?? '');

  if (alert === 'critical' || alert === 'elevated' || alert === 'red') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Elevated guardian vigilance (${alert}) tightens macro investment read.`;
  } else if (alert === 'calm' || alert === 'green') {
    investmentNudge += 0.5;
    summary = `Calm guardian vigilance (${alert}) supports macro investment interpretation.`;
  }

  if (coverage === 'blind' || coverage === 'gapped' || coverage === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Blind guardian coverage weakens macro productivity spillover.';
  }

  if (trust === 'eroded' || trust === 'critical' || trust === 'lost') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Eroded guardian trust amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroGuardianVigilanceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroGuardianVigilanceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
