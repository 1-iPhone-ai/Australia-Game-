import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTeamAiSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 team intelligence spillover (distinct from energy layer id). */
export function readMacroTeamAiSpilloverFromV1018Team(inputs: MacroEconomyInputs): MacroTeamAiSpillover {
  const ti: any =
    inputs.teamIntelligence ??
    inputs.teamAi ??
    inputs.nationalTeamAi ??
    inputs.nationalSystems?.teamAi;
  if (!ti) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const cohesion = String(ti.cohesionBand ?? ti.teamCohesion?.band ?? '');
  const throughput = String(ti.analysisThroughput?.band ?? ti.intelThroughput?.band ?? '');
  const conflict = String(ti.internalConflict?.band ?? ti.frictionBand ?? '');

  if (cohesion === 'strong' || cohesion === 'high' || cohesion === 'aligned') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = `Strong team AI cohesion (${cohesion}) supports macro productivity read.`;
  } else if (cohesion === 'fractured' || cohesion === 'critical' || cohesion === 'low') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Fractured team AI cohesion (${cohesion}) drags macro productivity interpretation.`;
  }

  if (throughput === 'surging' || throughput === 'high') {
    investmentNudge += 1;
    productivityNudge += 1;
  } else if (throughput === 'stalled' || throughput === 'blocked') {
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled team intelligence throughput caps macro upside.';
  }

  if (conflict === 'elevated' || conflict === 'severe') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated internal AI team conflict weighs on macro cycle read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTeamAiSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTeamAiSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
