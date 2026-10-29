import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTeamAiCohesionSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 team AI cohesion spillover (Agent 18 domain; distinct from team AI layer). */
export function readMacroTeamAiCohesionSpilloverFromV1018(inputs: MacroEconomyInputs): MacroTeamAiCohesionSpillover {
  const tc: any =
    inputs.teamAiCohesion ??
    inputs.teamIntelligence?.cohesion ??
    inputs.teamAi?.cohesion ??
    inputs.nationalTeamAi?.cohesion;
  if (!tc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const alignment = String(tc.alignmentBand ?? tc.cohesionBand ?? tc.syncBand ?? '');
  const drift = String(tc.driftBand ?? tc.divergenceBand ?? '');
  const quality = String(tc.qualityBand ?? tc.outputBand ?? '');

  if (alignment === 'fractured' || alignment === 'critical' || alignment === 'split') {
    productivityNudge -= 3;
    cycleNudge -= 1;
    summary = `Fractured team AI cohesion (${alignment}) drags macro productivity read.`;
  } else if (alignment === 'unified' || alignment === 'strong') {
    productivityNudge += 1;
    summary = `Unified team AI cohesion (${alignment}) supports macro productivity interpretation.`;
  }

  if (drift === 'runaway' || drift === 'critical' || drift === 'unbounded') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Runaway team AI drift caps macro investment spillover.';
  }

  if (quality === 'degraded' || quality === 'critical' || quality === 'hallucinating') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Degraded team AI output quality weakens macro cycle signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTeamAiCohesionSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTeamAiCohesionSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
