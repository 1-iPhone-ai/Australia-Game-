import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCommandSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.17 command center spillover (distinct from transport layer). */
export function readMacroCommandSpilloverFromV1017Command(inputs: MacroEconomyInputs): MacroCommandSpillover {
  const cc: any =
    inputs.commandCenter ??
    inputs.nationalCommand ??
    inputs.aiCommandCenter ??
    inputs.nationalSystems?.commandCenter;
  if (!cc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const posture = String(cc.postureBand ?? cc.operationalPosture?.band ?? cc.alertPosture?.band ?? '');
  const coordination = String(cc.coordinationBand ?? cc.crossAgency?.band ?? cc.syncBand ?? '');
  const backlog = String(cc.decisionBacklog?.band ?? cc.pendingDirectives?.band ?? '');

  if (posture === 'crisis' || posture === 'red' || posture === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Crisis command posture (${posture}) drags macro cycle and investment read.`;
  } else if (posture === 'steady' || posture === 'green' || posture === 'normal') {
    cycleNudge += 0.5;
    summary = 'Steady command posture supports stable macro interpretation.';
  }

  if (coordination === 'fragmented' || coordination === 'degraded') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragmented command coordination weighs on productivity read.';
  } else if (coordination === 'integrated' || coordination === 'strong') {
    productivityNudge += 1;
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'elevated') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated command decision backlog signals policy paralysis read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCommandSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCommandSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
